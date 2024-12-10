import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import "@/styles/AiAssistant/agent.css";
// import "@/styles/AiAssistant/index.css"
import SidebarLayout from ".";
import CallScreen from "../../components/HomePage/CallScreen";
import aiAgentImg from "@/assets/add-agent.png";
import editIcon from "@/assets/Icons/edit-icon.svg";
import deleteIcon from "@/assets/Icons/delete.svg";
import { MdKeyboardArrowLeft } from "react-icons/md";
import Dropdown from "@/components/Widget/Dropdown";


import {
  createAiAgent,
  fetchAiAgents,
  fetchSingleAgent,
  updateAiAgent,
  deleteAiAgent,
} from "@/lib/api/ApiAiAssistant";
import toast from "react-hot-toast";
import debounce from "lodash/debounce";
import SelectVoiceDialog from "@/components/Dialog/SelectVoicesDialog";
import AgentSettings from "@/components/ai-assistant/ai-agents/AgentSettings";
import AdvancedSettings from "@/components/ai-assistant/ai-agents/AdvancedSettings";
import { hangUpWebCall, makeWebCall } from "@/Utils/webCallHandler";
import { FaSortDown } from "react-icons/fa";



export default function AiAssistant() {
  const router = useRouter();

  

  const [isOpen, setIsOpen] = useState(false);
  const [agents, setAgents] = useState([]);
  const [aiAgent, setAiAgent] = useState({});
  const [agentAdded, setAgentAdded] = useState(false);
  const [isClickedOnAgentName, setIsClickedOnAgentName] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState(null);
  const [inCall, setInCall] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    base_prompt: "",
    chatgpt_model: "",
    who_speaks_first: "",
    voice_id: "",
    welcome_msg: "",
    call_transfer_prompt: "",
    transfer_call_number: "",
  });

  const [advancedSettings, setAdvancedSettings] = useState({
    voice_temperature: 0.5,
    voice_speed: 0.5,
    end_call_duration: 600,
    ambient_sound: "",
    ambient_sound_volume: 0.5,
    responsiveness: 0.5,
    interruption_sensitivity: 0.5,
    reminder_interval: 10,
    reminder_count: 1,
    boosted_keywords: "",
    fallback_voice_ids: "",
    enable_backchannel: false,
    language: "en-US (English - US)",
    agent_level_webhook_url: "",
    enable_speech_normalization: false,
  });
  const [privacySettings, setPrivacySettings] = useState({
    privacy_setting: "public",
  });

  const [isChanged, setIsChanged] = useState(false);
  const [isAdvancedChanged, setIsAdvancedChanged] = useState(false);
  const [isPrivacyChanged, setIsPrivacyChanged] = useState(false);
  const [showToolPopup, setShowToolPopup] = useState(false);
  const [calendarTools, setCalendarTools] = useState([]);

  async function addAgent() {
    const res = await createAiAgent();
    if (res.data) {
      setAgentAdded(true);
      toast.success("Agent added successfully");
    } else {
      toast.error("Failed to add agent");
    }
  }

  const handleDelete = async () => {
    try {
      const res = await deleteAiAgent(selectedAgentId);

      if (res.data) {
        toast.success("Agent deleted successfully");

        const remainingAgents = agents.filter(
          (agent) => agent._id !== selectedAgentId
        );
        setAgents(remainingAgents);

        if (remainingAgents.length > 0) {
          await router.replace({
            pathname: router.pathname,
            query: { agentId: remainingAgents[0]._id },
          });
          setSelectedAgentId(remainingAgents[0]._id);
          getSingleAgent(remainingAgents[0]._id);
        } else {
          setSelectedAgentId(null);
          await router.replace(router.pathname);
        }
      } else {
        toast.error("Failed to delete agent");
      }
    } catch (error) {
      console.error("Error deleting agent:", error);
      toast.error("An error occurred while deleting the agent");
    }
  };

  async function getAgents() {
    const res = await fetchAiAgents();
    if (res.data) {
      const respondedAgents = res?.data?.ai_agents;
      setAgents(respondedAgents);

      const agentId = router.query.agentId;

      if (agentId) {
        setSelectedAgentId(agentId);
        getSingleAgent(agentId);
      } else if (respondedAgents.length > 0) {
        const firstAgentId = respondedAgents[0]._id;
        setSelectedAgentId(firstAgentId);
        getSingleAgent(firstAgentId);
      }
    } else {
      toast.error("Failed to fetch agents");
    }
  }

  async function getSingleAgent(agentId) {
    setSelectedAgentId(agentId);
    const res = await fetchSingleAgent(agentId);
    if (res.data) {
      const agentData = res.data.ai_agents;
      setAiAgent(agentData);
      setFormData({
        name: agentData.name || "",
        base_prompt: agentData.base_prompt || "",
        chatgpt_model: agentData.chatgpt_model || "",
        who_speaks_first: agentData.who_speaks_first || "",
        voice_id: agentData.voice_id || "",
        welcome_msg: agentData.welcome_msg || "",
        call_transfer_prompt: agentData.call_transfer_prompt || "",
        transfer_call_number: agentData.transfer_call_number || "",
      });

      setAdvancedSettings({
        voice_temperature: agentData.voice_temperature || 0.5,
        voice_speed: agentData.voice_speed || 0.5,
        end_call_duration: agentData.end_call_duration || 600,
        ambient_sound: agentData.ambient_sound || "",
        ambient_sound_volume: agentData.ambient_sound_volume || 1.0,
        responsiveness: agentData.responsiveness || 1.0,
        interruption_sensitivity: agentData.interruption_sensitivity || 1.0,
        reminder_interval: agentData.reminder_interval || 10,
        reminder_count: agentData.reminder_count || 1,
        boosted_keywords: agentData.boosted_keywords || "",
        fallback_voice_ids: agentData.fallback_voice_ids || "",
        enable_backchannel: agentData.enable_backchannel || false,
        language: agentData.language || "en",
        agent_level_webhook_url: agentData.agent_level_webhook_url || "",
        enable_speech_normalization:
          agentData.enable_speech_normalization || false,
      });

      setPrivacySettings({
        privacy_setting: agentData.privacy_setting || false,
      });

      setCalendarTools(agentData.calendar_tools || []);
      setIsChanged(false); // Reset the change state when a new agent is loaded
    } else {
      toast.error("Failed to fetch agent details");
    }
  }

  useEffect(() => {
    if (router.isReady) {
      getAgents();
    }
    setAgentAdded(false);
  }, [router.isReady, agentAdded]);

  useEffect(() => {
    if (selectedAgentId) {
      router.push({
        pathname: router.pathname,
        query: { agentId: selectedAgentId },
      });
    }
    setIsClickedOnAgentName(false);
  }, [selectedAgentId]);


  

  const debouncedUpdate = useCallback(
    debounce(async (updatedSettings) => {
      const res = await updateAiAgent(selectedAgentId, updatedSettings);
      if (res.data) {
        toast.success("Settings updated successfully");
      } else {
        toast.error("Failed to update settings");
      }
    }, 500),
    [selectedAgentId]
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setIsChanged(true);
  };

  const handleAdvancedChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle immediate update for non-text inputs
    if (type !== "text") {
      const updatedValue =
        type === "checkbox"
          ? checked
          : type === "range"
          ? parseFloat(value)
          : value;

      const updatedSettings = {
        ...advancedSettings,
        [name]: updatedValue,
      };

      setAdvancedSettings(updatedSettings);
      debouncedUpdate(updatedSettings); // Immediately call API for non-text inputs
    } else {
      // For text inputs, only update the state but don't call the API
      setAdvancedSettings({
        ...advancedSettings,
        [name]: value,
      });
      setIsAdvancedChanged(true);
    }
  };

  const handleAdvancedBlur = (e) => {
    const { name, value } = e.target;

    const updatedSettings = {
      ...advancedSettings,
      [name]: value,
    };

    debouncedUpdate(updatedSettings); // Call API when text input loses focus
  };

  const handleDropdownAdvancedChange = (name, value) => {
    const updatedSettings = { ...advancedSettings, [name]: value };
    setAdvancedSettings(updatedSettings);
    debouncedUpdate(updatedSettings);
    setIsAdvancedChanged(true);
  };

  const handlePrivacyChange = (e) => {
    const { checked } = e.target;
    const updatedSettings = { privacy_setting: checked ? "private" : "public" };
    setPrivacySettings(updatedSettings);
    debouncedUpdate(updatedSettings);
    setIsPrivacyChanged(true);
  };

  const handleMakeWebCall = async (agentId) => {
    // Assuming `makeWebCall` is a function that handles the web call
    makeWebCall(agentId);
    setInCall(true); // Set inCall to true on making the call
  };

  const handleDropdownChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    setIsChanged(true);
  };

  const handleSubmit = async () => {
    // Check if there are any new calendar tools with empty required fields
    const hasInvalidNewTool = calendarTools.some(
      (tool) => !tool.cal_api_key || !tool.cal_event_type_id
    );

    if (hasInvalidNewTool) {
      toast.error(
        "Please fill in both API Key and Event Type ID before saving."
      );
      return;
    }

    const res = await updateAiAgent(selectedAgentId, {
      ...formData,
      calendar_tools: calendarTools, // Include calendar tools in the update
    });

    if (res.data) {
      console.log("this ai agent values:",res);
      toast.success("Agent updated successfully");
      setIsChanged(false); // Reset the change state after successful update
      setIsClickedOnAgentName(false);
      getAgents();
    } else {
      toast.error("Failed to update agent");
    }
  };

  const updateVoice = async (voice_id, voice_engine_name, voice_name) => {
    const res = await updateAiAgent(selectedAgentId, {
      voice_id,
      voice_engine_name,
      voice_name,
    });
    if (res.data) {
      toast.success("Agent updated successfully");
      getSingleAgent(selectedAgentId);
      setIsChanged(false); // Reset the change state after successful update
      setIsClickedOnAgentName(false);
      getAgents();
    } else {
      toast.error("Failed to update agent");
    }
  };

  const toggleToolPopup = () => {
    setShowToolPopup(!showToolPopup);
  };

  const handleDeleteCalendarTool = (index) => {
    const updatedTools = [...calendarTools];
    updatedTools.splice(index, 1);
    setCalendarTools(updatedTools);
    setIsChanged(true);
  };

  const handleCalendarToolChange = (index, key, value) => {
    const updatedTools = [...calendarTools];
    updatedTools[index] = { ...updatedTools[index], [key]: value };
    setCalendarTools(updatedTools);
    setIsChanged(true);
  };

  const addCalendarTool = () => {
    setCalendarTools([
      ...calendarTools,
      {
        cal_api_key: "",
        cal_event_type_id: "",
        cal_timezone: "",
      },
    ]);
    setShowToolPopup(false);
    setIsChanged(true);
  };

  /**
   * here i paste the code of the model option component for recreation
  */
  const modelOptions = [
    { name: "GPT 3.5 Turbo", value: "gpt-3.5-turbo" },
    { name: "GPT 4o Mini", value: "gpt-4o-mini" },
    { name: "GPT 4o", value: "gpt-4o" },
    { name: "GPT 4", value: "gpt-4" },
    { name: "GPT 4 Turbo", value: "gpt-4-0125-preview" },
  ];

  const whoSpeaksFirstOptions = [
    { name: "Ai", value: "ai" },
    { name: "Human", value: "human" },
  ];

  return (
    <>
      <Head>
        <title>
          Custom AI Chatbot Solutions for Your Business | UrbanChat.ai
        </title>
        
        <meta
          name="description"
          content="Empower your online presence with UrbanChat.ai's customizable AI chatbots. Perfect for businesses looking to automate customer support, enhance engagement, and boost efficiency. Start building your ideal chatbot today and transform your customer interaction experience. Join the future of AI chatbots with UrbanChat.ai."
          key="desc"
        />

      </Head>
      <SidebarLayout>
        <audio id="remoteMedia" autoPlay={true} />
        <div className="agentid-header">
    
            <div className="back-button">
              <MdKeyboardArrowLeft/>
            </div>
            <div className="agent-container">
              <div className="agentname-container">
                {isClickedOnAgentName ? (
                      <div>
                        <input
                          id="custom-url"
                          style={{ width: "fit-content" }}
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="When user is angry or requests a human agent, transfer the call to a human."
                        />
                        <button className="fill-btn" onClick={handleSubmit}>
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex-start" style={{width:'fit-content',height:'20px'}}>
                        <h5>{aiAgent.name}</h5>
                        <button
                          className="gray-btn1 hover"
                          onClick={() => setIsClickedOnAgentName(true)}
                        >
                          <img
                            src={editIcon.src}
                            width={15}
                            height={15}
                            alt="add agent image"
                            title="Edit name"
                          />
                        </button>
                      </div>
                    )}
              </div>
              <div>
                <p className="fade-text" style={{margin:0}}>Agent ID: {aiAgent._id}</p>
              </div>
              
            </div>
        </div>
        <div className="agent-container" style={{background:"var(--color-surface2)",paddingTop:'75px'}}>
          <aside className="fixed-sidebar" style={{paddingBottom:60,display:'none'}}>
            <button className="outline-btn" onClick={addAgent}>
              + Add agent
            </button>
            {agents?.map((agent) => (
              <button
                style={{ padding: "10px", paddingLeft: "25px",border:'1px solid white', borderRadius:'25px'}}
                key={agent._id}
                className={`${
                  selectedAgentId === agent._id
                    ? "fill-btn active"
                    : "ghost-btn"
                }`}
                onClick={() => getSingleAgent(agent._id)}
                title={agent.name}
              >
                {agent.name.length > 9 ? `${agent.name.slice(0, 9)}...` : agent.name}
              </button>
            ))}
          </aside>



          <main className="settings-container setting-container-copy" style={{position:'relative'}}>
            <div className="voice-gpt-cotainer">
              <div className="voice-container">
                <p
                  className="info-text border-white hover:scale-105 ease-in-out duration-200 cursor-pointer flex justify-center gap-1 items-center"
                  onClick={() => {
                    setIsOpen(true);
                  }}
                >
                  <b>Voice : </b>
                  {aiAgent.voice_name}
                  <FaSortDown className="mb-1 ml-3" />
                </p>
                <SelectVoiceDialog
                      isOpen={isOpen}
                      setIsOpen={setIsOpen}
                      updateVoice={updateVoice}
                />
              </div>

              <div>
                <div>
                  <Dropdown
                    items={modelOptions}
                    style={{ backgroundColor: "rgba(85, 87, 104, 0.2)" }}
                    currentValue={formData.chatgpt_model}
                    onSelect={(value) => handleDropdownChange("chatgpt_model", value)}
                  />
                </div>
              </div>
              <div>
                <div>
                  <Dropdown
                    items={whoSpeaksFirstOptions}
                    style={{ backgroundColor: "rgba(85, 87, 104, 0.2)" }}
                    currentValue={formData.who_speaks_first}
                    onSelect={(value) =>
                      handleDropdownChange("who_speaks_first", value)
                    }
                  />
                </div>
              </div>
              <button
                className="fill-btn test-btn"
                onClick={() => handleMakeWebCall(aiAgent._id)}
              >
                Test Audio
              </button>
            </div>


            {selectedAgentId ? (
              <>
                {/* <header className="fade-background" style={{display:'none'}}>
                  {isClickedOnAgentName ? (
                    <div className="flex-start">
                      <input
                        id="custom-url"
                        style={{ width: "fit-content" }}
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="When user is angry or requests a human agent, transfer the call to a human."
                      />
                      <button className="fill-btn" onClick={handleSubmit}>
                        Save
                      </button>
                    </div>
                  ) : (
                    <div className="flex-start  " style={{display:'none'}}>
                      <h1>{aiAgent.name}</h1>
                      <button
                        className="gray-btn hover"
                        onClick={() => setIsClickedOnAgentName(true)}
                      >
                        <img
                          src={editIcon.src}
                          width={20}
                          height={20}
                          alt="add agent image"
                        />
                      </button>
                    </div>
                  )}
                  <div className="flex-between" >
                    <div style={{display:'none'}}>
                      <p className="fade-text">Agent ID: {aiAgent._id}</p>
                      <p
                        className="info-text  border-white hover:scale-105 ease-in-out duration-200 cursor-pointer flex justify-center gap-1 items-center"
                        onClick={() => {
                          setIsOpen(true);
                        }}
                      >
                        <b>Voice : </b>
                        {aiAgent.voice_name}
                        <FaSortDown className="mb-1 ml-3" />
                      </p>
                    </div>
                    <SelectVoiceDialog
                      isOpen={isOpen}
                      setIsOpen={setIsOpen}
                      updateVoice={updateVoice}
                    />
                    <div className="header-actions" style={{display:'none'}}>
                      <button
                        className="fill-btn text-sm sm:xs"
                        onClick={() => handleMakeWebCall(aiAgent._id)}
                      >
                        Test Audio
                      </button>
                      <button className="gray-btn" onClick={handleDelete}>
                        <img
                          className="delete-icon"
                          src={deleteIcon.src}
                          alt="Delete"
                        />
                      </button>
                    </div>
                  </div>
                </header> */}
                <section className="settings-section">
                  <div className="settings-content">
                    <AgentSettings
                      formData={formData}
                      handleInputChange={handleInputChange}
                      handleDropdownChange={handleDropdownChange}
                      handleSubmit={handleSubmit}
                      isChanged={isChanged}
                      toggleToolPopup={toggleToolPopup}
                      showToolPopup={showToolPopup}
                      addCalendarTool={addCalendarTool}
                      calendarTools={calendarTools}
                      handleDeleteCalendarTool={handleDeleteCalendarTool}
                      handleCalendarToolChange={handleCalendarToolChange}
                    />
                    

                    {/* this is code of advanceSetting and this file is also exist */}
                    {/* <AdvancedSettings
                      advancedSettings={advancedSettings}
                      privacySettings={privacySettings}
                      handleAdvancedChange={handleAdvancedChange}
                      handleDropdownAdvancedChange={
                        handleDropdownAdvancedChange
                      }
                      handlePrivacyChange={handlePrivacyChange}
                      isAdvancedChanged={isAdvancedChanged}
                      isPrivacyChanged={isPrivacyChanged}
                      handleAdvancedBlur={handleAdvancedBlur}
                    /> */}
                  </div>
                  {/* Conditionally render CallScreen */}
                  {inCall && (
                    <CallScreen onClose={() => setInCall(false)} />
                  )}{" "}
                </section>
              </>
            ) : (
              <div className="fade grid-center text-center">
                <div>
                  <img
                    src={aiAgentImg.src}
                    width={"400px"}
                    height={"400px"}
                    alt="add agent image"
                  />
                  <h3 className="fade-text">
                    Add an Agent to Start Your Journey{" "}
                  </h3>
                </div>
              </div>
            )}
          </main>
         
        </div>
    
        
      </SidebarLayout>
    </>
  );
}





