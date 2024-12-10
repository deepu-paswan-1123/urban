import React, { useContext, useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import ai_logo from "@/assets/logo.svg";
import aiAgentIcon from "@/assets/Icons/ai-agent.svg";
import phoneIcon from "@/assets/Icons/phone-icon.svg";
import historyIcon from "@/assets/Icons/history-icon.svg";
import apiKeyIcon from "@/assets/Icons/api-key-icon.svg";
import billingIcon from "@/assets/Icons/billing-icon.svg";
import webhooksIcon from "@/assets/Icons/webhooks-icon.svg";
import BillingBanner from "@/components/ai-assistant/ai-agents/BillingBanner";
import "@/styles/AiAssistant/index.css";
import { ProfileContext } from "../_app";
import { FaBars, FaTimes } from "react-icons/fa";
import Header from "@/components/Header";
import { AgentDropdown } from "./ai-agents";
import { CalenderTools } from "@/components/ai-assistant/ai-agents/AgentSettings";


const SidebarLayout = ({ children }) => {
  const router = useRouter();
  const { pathname } = router;
  const { globalProfileData } = useContext(ProfileContext);
  const [isTokenExist, setIsTokenExist] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    handleResize(); // Run on initial load
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setIsTokenExist(true);
    } else {
      setIsTokenExist(false);
    }
  });
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="assistant-main">
        <div className="flex flex-col">
          <div className="nav-layout" style={{ width: "0" }}>
            {isTokenExist ? (
              <Link className="profile-img" href="/my-profile"></Link>
            ) : (
              <div className="profile-img invisible">
                <img src="/path/to/placeholder.png" alt="Placeholder" />
              </div>
            )}
          </div>

          <BillingBanner />

          <button className="hamburger-menu" onClick={toggleSidebar}>
            {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>

          <div className={`sidebar-container ${isSidebarOpen ? "open" : ""}`}>
            <aside
              className="sidebar-layout"
              style={{ background: "green", width: "0", display: "none" }}
            >
              {isSmallScreen && (
                <div className="sidebar-logo">
                  <Link href="/">
                    <img
                      className="logo"
                      src={ai_logo.src}
                      alt="Urban Chat Logo"
                    />
                  </Link>
                </div>
              )}
              <nav className="menu">
                <ul>
                  <Link href="/ai-assistant/ai-agents">
                    <li
                      className={
                        pathname === "/ai-assistant/ai-agents" ? "active" : ""
                      }
                    >
                      <img
                        className="ai-agent"
                        src={aiAgentIcon.src}
                        alt="AI Agents"
                      />
                      <p>AI Agents</p>
                    </li>
                  </Link>
                  <Link href="/ai-assistant/phones">
                    <li
                      className={
                        pathname === "/ai-assistant/phones" ? "active" : ""
                      }
                    >
                      <img
                        className="phone-icon"
                        src={phoneIcon.src}
                        alt="Phones"
                      />
                      <p>Phones</p>
                    </li>
                  </Link>
                  <Link href="/ai-assistant/history">
                    <li
                      className={
                        pathname === "/ai-assistant/history" ? "active" : ""
                      }
                    >
                      <img
                        className="history-icon"
                        src={historyIcon.src}
                        alt="History"
                      />
                      <p>History</p>
                    </li>
                  </Link>
                  <Link href="/ai-assistant/billing">
                    <li
                      className={
                        pathname === "/ai-assistant/billing" ? "active" : ""
                      }
                    >
                      <img
                        className="billing-icon"
                        src={billingIcon.src}
                        alt="Billing"
                      />
                      <p>Billing</p>
                    </li>
                  </Link>
                </ul>
              </nav>
            </aside>
            {/* <main className="main-content">{children}</main> */}
            <main className="main-content">{children}</main>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarLayout;




