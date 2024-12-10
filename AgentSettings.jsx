import React, { useEffect, useState } from "react";
import Dropdown from "@/components/Widget/Dropdown";
import deleteIcon from "@/assets/Icons/delete.svg";
import Select from "react-select";
import screenshot from "@/assets/screenshot.png";
import "@/styles/AiAssistant/AgentSetting.css";

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

export default function AgentSettings({
  formData,
  handleInputChange,
  handleDropdownChange,
  handleSubmit,
  isChanged,
  addCalendarTool,
  calendarTools,
  handleDeleteCalendarTool,
  handleCalendarToolChange,
}) {
  const [openDropdown, setOpenDropdown] = useState(null); // To track which dropdown is open

  const toggleDropdown = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  return (
    <>
      <div
        className="connect-agent"
        style={{ marginTop: 71, borderRadius: "5px" }}
      >
        {isChanged && (
          <div
            className="flex-end sticky top-0 bg-[var(--color-surface2)]"
            style={{ marginBottom: "-30px", zIndex: 999 }}
          >
            <button className="fill-btn" onClick={handleSubmit}>
              Save Changes
            </button>
          </div>
        )}
        <div className="Agentsetting-container">
          <div style={{ width: "700px" }}>
            <h3 style={{ margin: "5px 7px" }}>Agent Prompt</h3>
            <p className="fade-text" style={{ margin: "5px 7px" }}>
              A universal prompt setting the agent's role and conversation style
              across all states.
            </p>
            <div className="custom-url">
              <textarea
                id="custom-url"
                name="base_prompt"
                rows="20"
                value={formData.base_prompt}
                onChange={handleInputChange}
                cols="50"
                placeholder="Type in a universal prompt for your agent, such as its role, objective and conversational style etc."
                style={{
                  height: "65vh",
                  fontSize: ".875em",
                  lineHeight: "1.25em",
                }}
              ></textarea>
            </div>
          </div>

          <div className="message-container" style={{marginTop:'25px'}}>
            {/* Welcome Message Dropdown */}
            <div className="dropdown-container">
              <button
                onClick={() => toggleDropdown("welcomeMessage")}
                className="dropdown-button"
              >
                 Welcome Message
                <span
                  className={`dropdown-arrow ${
                    openDropdown === "welcomeMessage" ? "open" : ""
                  }`}
                >
                  &#9662;
                </span>
              </button>
              {openDropdown === "welcomeMessage" && (
                <div className="dropdown-menu open message-form">
                  <h3>Welcome Message</h3>
                  <div className="custom-url">
                    <textarea
                      id="custom-url"
                      name="welcome_msg"
                      rows="5"
                      value={formData.welcome_msg}
                      onChange={handleInputChange}
                      cols="50"
                      placeholder="Add your begin message"
                      style={{fontSize:'12px'}}
                    ></textarea>
                  </div>
                </div>
              )}
            </div>

            {/* Call Transfer Dropdown */}
            <div className="dropdown-container">
              <button
                onClick={() => toggleDropdown("callTransfer")}
                className="dropdown-button"
              >
                Call Transfer
                <span
                  className={`dropdown-arrow ${
                    openDropdown === "callTransfer" ? "open" : ""
                  }`}
                >
                  &#9662;
                </span>
              </button>
              {openDropdown === "callTransfer" && (
                <div className="dropdown-menu open calltransfer-form">
                  <h3>Call Transfer</h3>
                  <div className="custom-url">
                    <h4>Prompt</h4>
                    <input
                      id="custom-url"
                      name="call_transfer_prompt"
                      value={formData.call_transfer_prompt}
                      onChange={handleInputChange}
                      placeholder="When user is angry or requests a human agent, transfer the call to a human."
                    />
                  </div>
                  <div className="custom-url">
                    <h4>Transfer To</h4>
                    <input
                      id="custom-url"
                      name="transfer_call_number"
                      value={formData.transfer_call_number}
                      onChange={handleInputChange}
                      placeholder="+14154154155"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* General Tools Dropdown */}
            <div className="dropdown-container">
              <button
                onClick={() => toggleDropdown("generalTools")}
                className="dropdown-button"
              >
                General Tools
                <span
                  className={`dropdown-arrow ${
                    openDropdown === "generalTools" ? "open" : ""
                  }`}
                >
                  &#9662;
                </span>
              </button>
              {openDropdown === "generalTools" && (
                <div className="dropdown-menu open">
                  <div className="general-tools" style={{height:'250px',overflow:'auto'}}>
                    <div className="flex justify-between">
                      <h3>General Tools (Optional)</h3>
                    </div>
                    <p className="fade-text">
                      Enable your agent with capabilities such as calendar
                      bookings, call termination, or your own custom functions.
                      It can be triggered across all states.
                    </p>
                    <div className="embedded-popup border border-gray-100 shadow-lg rounded-lg p-4" >
                      <div className="popup-content">
                        <div
                          className="tool-item cursor-pointer hover:bg-gray-100 p-2 rounded-md"
                          onClick={addCalendarTool}
                          style={{fontSize:'13px'}}
                        >
                          <span
                            role="img"
                            aria-label="book-calendar fade-background"
                          >
                            📅
                          </span>
                          
                          Book on the Calendar (Cal.com)
                        </div>
                      </div>
                    </div>
                    {calendarTools.length > 0 &&
                      calendarTools.map((tool, index) => (
                        <div
                          className="calendar-form"
                          key={index}
                
                        >
                          <div className="calendar-header flex justify-between">
                            <h3>Book on the Calendar (Cal.com)</h3>
                            <button
                              className="gray-btn"
                              onClick={() => handleDeleteCalendarTool(index)}
                              style={{background:'none'}}
                            >
                              <img src={deleteIcon.src} alt="Delete" height={'25px'}/>
                            </button>
                          </div>
                          <div className="form-group">
                            <h4>Description (Optional)</h4>
                            <input
                              type="text"
                              value="When users ask to book an appointment"
                              onChange={(e) =>
                                handleCalendarToolChange(
                                  index,
                                  "description",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="form-group">
                            <h4>API Key (Cal.com)</h4>
                            <input
                              type="text"
                              value={tool.cal_api_key}
                              onChange={(e) =>
                                handleCalendarToolChange(
                                  index,
                                  "cal_api_key",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="form-group">
                            <h4>Event Type ID (Cal.com)</h4>
                            <input
                              type="text"
                              value={tool.cal_event_type_id}
                              onChange={(e) =>
                                handleCalendarToolChange(
                                  index,
                                  "cal_event_type_id",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="form-group">
                            <CountryTimeZone
                              tool={tool}
                              handleCalendarToolChange={
                                handleCalendarToolChange
                              }
                              index={index}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// export default function AgentSettings({
//   formData,
//   handleInputChange,
//   handleDropdownChange,
//   handleSubmit,
//   isChanged,
//   toggleToolPopup,
//   showToolPopup,
//   addCalendarTool,
//   calendarTools,
//   handleDeleteCalendarTool,
//   handleCalendarToolChange,
// }) {
//   console.log("this is formData of AgentSetting", formData);
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleDropdown = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <>
//       <div
//         className="connect-agent"
//         style={{ marginBottom: 500, marginTop: 71, borderRadius: "5px" }}
//       >
//         {isChanged && (
//           <div
//             className="flex-end sticky top-0 bg-[var(--color-surface2)]"
//             style={{ marginBottom: "-30px", zIndex: 999 }}
//           >
//             <button className="fill-btn" onClick={handleSubmit}>
//               Save Changes
//             </button>
//           </div>
//         )}
//         <div className="Agentsetting-container">
//           <div style={{width:'700px'}}>
//             <h3 style={{ margin: "5px 7px" }}>Agent Prompt</h3>
//             <p className="fade-text" style={{ margin: "5px 7px" }}>
//               A universal prompt setting the agent's role and conversation style
//               across all states.
//             </p>
//             <div className="custom-url">
//               <textarea
//                 id="custom-url"
//                 name="base_prompt"
//                 rows="20"
//                 value={formData.base_prompt}
//                 onChange={handleInputChange}
//                 cols="50"
//                 placeholder="Type in a universal prompt for your agent, such as its role, objective and conversational style etc."
//                 style={{
//                   height: "65vh",
//                   fontSize: ".875em",
//                   lineHeight: "1.25em",
//                 }}
//               ></textarea>
//             </div>
//           </div>

//           {/* <div>
//                 <h3>Chatbot Model</h3>
//                 <div>
//                   <Dropdown
//                     items={modelOptions}
//                     style={{ backgroundColor: "rgba(85, 87, 104, 0.2)" }}
//                     currentValue={formData.chatgpt_model}
//                     onSelect={(value) => handleDropdownChange("chatgpt_model", value)}
//                   />
//                 </div>
//               </div> */}

//           {/* <div>
//                 <h3>Who Speaks First?</h3>
//                 <div>
//                   <Dropdown
//                     items={whoSpeaksFirstOptions}
//                     style={{ backgroundColor: "rgba(85, 87, 104, 0.2)" }}
//                     currentValue={formData.who_speaks_first}
//                     onSelect={(value) =>
//                       handleDropdownChange("who_speaks_first", value)
//                     }
//                   />
//                 </div>
//               </div> */}
//           <div
//             className="message-container"
//           >
//             <div className="dropdown-container">
//               <button onClick={toggleDropdown} className="dropdown-button">
//                 Toggle Dropdown
//                 <span className={`dropdown-arrow ${isOpen ? "open" : ""}`}>
//                   &#9662;
//                 </span>
//               </button>
//               <div className={`dropdown-menu ${isOpen ? "open" : ""}`}>
//                 <div>
//                   <h3>Welcome Message</h3>
//                   <div className="custom-url">
//                     <textarea
//                       id="custom-url"
//                       name="welcome_msg"
//                       rows="5"
//                       value={formData.welcome_msg}
//                       onChange={handleInputChange}
//                       cols="50"
//                       placeholder="Add your begin message"
//                     ></textarea>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="dropdown-container">
//               <button onClick={toggleDropdown} className="dropdown-button">
//                 Toggle Dropdown
//                 <span className={`dropdown-arrow ${isOpen ? "open" : ""}`}>
//                   &#9662;
//                 </span>
//               </button>
//               <div className={`dropdown-menu ${isOpen ? "open" : ""}`}>
//                 <div>
//                   <h3>Call Transfer</h3>
//                   <h4>Prompt</h4>
//                   <div className="custom-url">
//                     <input
//                       id="custom-url"
//                       name="call_transfer_prompt"
//                       value={formData.call_transfer_prompt}
//                       onChange={handleInputChange}
//                       placeholder="When user is angry or requests a human agent, transfer the call to a human."
//                     />
//                   </div>
//                   <h4>Transfer To</h4>
//                   <div className="custom-url">
//                     <input
//                       id="custom-url"
//                       name="transfer_call_number"
//                       value={formData.transfer_call_number}
//                       onChange={handleInputChange}
//                       placeholder="+14154154155"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="dropdown-container">
//               <button onClick={toggleDropdown} className="dropdown-button">
//                 Toggle Dropdown
//                 <span className={`dropdown-arrow ${isOpen ? "open" : ""}`}>
//                   &#9662;
//                 </span>
//               </button>
//               <div className={`dropdown-menu ${isOpen ? "open" : ""}`}>
//                 <div className="general-tools">
//                   <div className="flex justify-between">
//                     <h3>General Tools (Optional)</h3>
//                   </div>
//                   <p className="fade-text">
//                     Enable your agent with capabilities such as calendar
//                     bookings, call termination, or your own custom functions. It
//                     can be triggered across all states.
//                   </p>
//                   {
//                     <div className="embedded-popup border border-gray-100 shadow-lg rounded-lg p-4">
//                       <div className="popup-content">
//                         <div
//                           className="tool-item cursor-pointer hover:bg-gray-100 p-2 rounded-md"
//                           onClick={addCalendarTool}
//                         >
//                           <span
//                             role="img"
//                             aria-label="book-calendar fade-backgrond "
//                           >
//                             📅
//                           </span>
//                           Book on the Calendar (Cal.com)
//                         </div>
//                       </div>
//                     </div>
//                   }
//                   {calendarTools.length > 0 &&
//                     calendarTools.map((tool, index) => (
//                       <div className="calendar-form" key={index}>
//                         <div className="calendar-header flex justify-between">
//                           <h3>Book on the Calendar (Cal.com)</h3>
//                           <button
//                             className="gray-btn"
//                             onClick={() => handleDeleteCalendarTool(index)}
//                           >
//                             <img src={deleteIcon.src} alt="Delete" />
//                           </button>
//                         </div>
//                         <div className="form-group">
//                           <h4>Description (Optional)</h4>
//                           <input
//                             type="text"
//                             value="When users ask to book an appointment"
//                             onChange={(e) =>
//                               handleCalendarToolChange(
//                                 index,
//                                 "description",
//                                 e.target.value
//                               )
//                             }
//                           />
//                         </div>
//                         <div className="form-group">
//                           <h4>API Key (Cal.com)</h4>
//                           <input
//                             type="text"
//                             value={tool.cal_api_key}
//                             onChange={(e) =>
//                               handleCalendarToolChange(
//                                 index,
//                                 "cal_api_key",
//                                 e.target.value
//                               )
//                             }
//                           />
//                         </div>
//                         <div className="form-group">
//                           <div className="guideline-group">
//                             <h4 style={{ marginBlockEnd: 0 }}>
//                               Event Type ID (Cal.com)
//                             </h4>
//                             <EventIdGuideline />
//                           </div>
//                           <input
//                             type="text"
//                             value={tool.cal_event_type_id}
//                             onChange={(e) =>
//                               handleCalendarToolChange(
//                                 index,
//                                 "cal_event_type_id",
//                                 e.target.value
//                               )
//                             }
//                           />
//                         </div>
//                         <div className="form-group">
//                           <CountryTimeZone
//                             tool={tool}
//                             handleCalendarToolChange={handleCalendarToolChange}
//                             index={index}
//                           />
//                         </div>
//                       </div>
//                     ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

/**
 * this is the function of the guideline for users.
 *
 */
function EventIdGuideline() {
  const [showModal, setShowModal] = React.useState(false);

  return (
    <>
      <span className="guideline-text">
        Guidelines for EventId and Api Key{" "}
      </span>
      <button className="guideline-ita-btn" onClick={() => setShowModal(true)}>
        !
      </button>
      {showModal ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            style={{ zIndex: "999" }}
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 guideline-container rounded-lg shadow-lg relative flex flex-col w-full outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between pl-5 rounded-t">
                  <h3 className="text-2xl font-semibold">
                    How to Find Event Type ID?
                  </h3>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto guideline-body">
                  <div>
                    <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                      1. Sign up or Log in – Go to{" "}
                      <a
                        href="https://cal.com"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Cal.com
                      </a>{" "}
                      and sign up for a new account or log in to your existing
                      account.
                    </p>
                  </div>

                  <div>
                    <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                      2. Access Event Types – Once logged in, locate the{" "}
                      <strong>"Event Types"</strong> option on the left-hand
                      side menu and click on it.
                    </p>
                  </div>

                  <div>
                    <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                      3. Create a New Event (If you don’t have one) – Click on
                      the <strong>“NEW”</strong> button located in the top-right
                      corner. Fill out the form to create a new event.
                    </p>
                  </div>

                  <div>
                    <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                      4. Locate the Event Type ID in the URL – After creating
                      the event, check the URL in your browser. You will see a
                      string of digits at the end of the URL like this:
                      <a
                        href="https://app.cal.com/event-types/1315665?tabName=setup"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        https://app.cal.com/event-types/1315665?tabName=setup
                      </a>
                      . The{" "}
                      <span
                        style={{
                          backgroundColor: "darkcyan",
                          padding: "0 5px",
                        }}
                      >
                        1315665
                      </span>{" "}
                      in the URL is your Event Type ID.
                    </p>
                  </div>

                  <div>
                    <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                      5. Paste in Input Box – Return to our website and paste
                      both the API key and Event ID into the input fields.
                    </p>
                  </div>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end pl-6 pr-6 rounded-b">
                  <button
                    className="guideline-close-btn mb-6 text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}

const CountryTimeZone = ({ tool, handleCalendarToolChange, index }) => {
  const [timezones, setTimezones] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCTScript = () => {
    return new Promise((resolve, reject) => {
      if (window.ct) {
        resolve(); // ct is already loaded
      } else {
        const script = document.createElement("script");
        script.src =
          "https://cdn.jsdelivr.net/npm/countries-and-timezones@2.3.0/dist/index.min.js";
        script.async = true;
        script.onload = resolve; // When the script is successfully loaded
        script.onerror = reject; // In case the script fails to load
        document.body.appendChild(script);
      }
    });
  };

  useEffect(() => {
    // Dynamically load the 'ct' script and then get timezones
    loadCTScript()
      .then(() => {
        const data = window.ct.getAllCountries(); // Ensure 'ct' is available from window
        const tzOptions = [];

        Object.values(data).forEach((country) => {
          if (country.timezones) {
            country.timezones.forEach((timezone) => {
              tzOptions.push({
                value: timezone,
                label: `${country.name} (${timezone})`, // Formatting label
              });
            });
          }
        });

        setTimezones(tzOptions); // Set the fetched timezones
        setLoading(false); // Set loading to false after data is fetched
      })
      .catch((error) => {
        console.error("Failed to load ct script:", error);
        setLoading(false);
      });
  }, []);

  const handleTimezoneChange = (selectedOption) => {
    // Update the selected timezone
    const newValue = selectedOption ? selectedOption.value : "";
    handleCalendarToolChange(index, "cal_timezone", newValue);
    console.log(screenshot);
  };

  return (
    <div>
      <h4 style={{ color: "white" }}>Timezone (Optional)</h4>
      <Select
        id="timezone"
        value={timezones.find((tz) => tz.value === tool.cal_timezone) || null}
        onChange={handleTimezoneChange}
        options={timezones}
        placeholder="Select a timezone"
        isClearable
        classNamePrefix="select"
        styles={{
          control: (provided) => ({
            ...provided,
            width: "400px",
            borderRadius: "10px",
            height: "40px",
            backgroundColor: "#55576833",
            display:'flex',
            alignItems:'center',
            color: "white",
            border: "none", // Remove border
            boxShadow: "none", // Remove shadow
            "&:hover": {
              border: "none", // No border on hover
              boxShadow: "none", // No shadow on hover
            },
            "&:focus": {
              border: "none", // No border on focus
              boxShadow: "none", // No shadow on focus
            },
            fontSize: "14px",
          }),
          menu: (provided) => ({
            ...provided,
            backgroundColor: "var(--color-surface2)",
            fontSize: "12px",
          }),
          option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused
              ? "darkcyan"
              : "var(--color-surface2)",
            color: "white",
            "&:active": {
              backgroundColor: "var(--color-surface2)",
            },
          }),
          singleValue: (provided) => ({
            ...provided,
            color: "white",
          }),
          placeholder: (provided) => ({
            ...provided,
            color: "white",
          }),
          input: (provided) => ({
            ...provided,
            color: "white",
          }),
          noOptionsMessage: (provided) => ({
            ...provided,
            color: "white",
          }),
        }}
      />
    </div>
  );
};
