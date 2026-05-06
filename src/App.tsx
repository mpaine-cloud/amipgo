/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BlogIndex from "./pages/BlogIndex";
import BlogPost from "./pages/BlogPost";
import AdminDashboard from "./pages/AdminDashboard";
import WorkspacePage from "./pages/WorkspacePage";
import PrivacyPage from "./pages/PrivacyPage";
import TeamPage from "./pages/TeamPage";
import { useEffect } from "react";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  useEffect(() => {
    // Record page view for main site stats
    const recordVisit = async () => {
      try {
        const statsRef = doc(db, "siteStats", "main");
        const hasVisited = localStorage.getItem('hasVisitedAmipGo');
        
        if (!hasVisited) {
          const docSnap = await getDoc(statsRef);
          if (docSnap.exists()) {
            localStorage.setItem('hasVisitedAmipGo', 'true');
            await updateDoc(statsRef, {
              visitors: docSnap.data().visitors + 1,
              lastUpdate: Date.now()
            });
          }
        }
      } catch (err) {
        console.error("Stats tracking error", err);
      }
    };
    recordVisit();
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-cream text-white font-sans selection:bg-moss selection:text-white">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/equipo" element={<TeamPage />} />
          <Route path="/workspace" element={<WorkspacePage />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/privacidad" element={<PrivacyPage />} />
        </Routes>
      </div>
    </Router>
  );
}

