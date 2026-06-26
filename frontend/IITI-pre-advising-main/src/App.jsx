import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";

import Login from "./login/login.jsx";
import Nav from "./navbar/nav.jsx";

import YearLevel from "./yearLevel/yearLevel.jsx";
import Section from "./yearLevel/section/section.jsx";
import List from "./yearLevel/list/list.jsx";
import ViewGrade from "./yearLevel/viewGrade/viewGrade.jsx";

import PreAdvising from "./pre-advising/pre-Advising.jsx";
import PreAdvisingList from "./pre-advising/pre-Advising list.jsx";

import Schedule from "./schedule/schedule.jsx";
import ViewSection from "./schedule/viewSection.jsx";
import ViewSchedule from "./schedule/viewSchedule.jsx";
import Settings from "./settings/settings.jsx";

import Profile from "./settings/profile.jsx";

import PreAdvisingFirstSem from "./pre-advising/pre-AdvisingFirstSem.jsx";
import PreAdvisingSecondSem from "./pre-advising/pre-AdvisingSecondSem.jsx";


// Lazy loaded dashboard
const Dashboard = lazy(() => import("./dashboard/dashboard.jsx"));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <Suspense fallback={null}>
              <Nav />
              <Dashboard />
            </Suspense>
          }
        />

        {/* Year Level */}
        <Route
          path="/year-level"
          element={
            <>
              <Nav />
              <YearLevel />
            </>
          }
        />

        {/* Pre-Advising */}
        <Route
          path="/pre-advising"
          element={
            <>
              <Nav />
              <PreAdvising />
            </>
          }
        />

        {/* This path opens the List */}
        <Route
          path="/pre-advising-list"
          element={
            <>
              <Nav />
              <PreAdvisingList />
            </>
          }
        />



       {/* Pre Advising First Sem */}
        <Route
          path="/pre-advising-1st-sem"
          element={
            <>
              <Nav />
              <PreAdvisingFirstSem />
            </>
          }
        />

         {/* Pre Advising second Sem */}
        <Route
          path="/pre-advising-2nd-sem"
          element={
            <>
              <Nav />
              <PreAdvisingSecondSem />
            </>
          }
        />

        {/* Schedule */}
        <Route
          path="/schedule"
          element={
            <>
              <Nav />
              <Schedule />
            </>
          }
        />

        {/* Settings */}
        <Route
          path="/settings"
          element={
            <>
              <Nav />
              <Settings />
            </>
          }
        />

        {/* Profile */}
        <Route
          path="/profile"
          element={
            <>
              <Nav />
              <Profile />
            </>
          }
        />

        {/* Section */}
        <Route
          path="/section"
          element={
            <>
              <Nav />
              <Section />
            </>
          }
        />

        {/* List */}
        <Route
          path="/list"
          element={
            <>
              <Nav />
              <List />
            </>
          }
        />
       {/* View Grade */}
        <Route
          path="/viewGrade"
          element={
            <>
              <Nav />
              <ViewGrade />
            </>
          }
        />
       {/* View Section */}
        <Route
          path="/viewSection"
          element={
            <>
              <Nav />
              <ViewSection />
            </>
          }
        />
       {/* View schedule */}
        <Route
          path="/viewSchedule"
          element={
            <>
              <Nav />
              <ViewSchedule />
            </>
          }
        />


      </Routes>
    </BrowserRouter>
  );
}

export default App;