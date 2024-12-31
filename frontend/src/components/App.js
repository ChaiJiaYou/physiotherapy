import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './Layout';
import LoginPage from './LoginPage';
import ForgotPassword from './ForgotPassword';
import ForgotPasswordEmail from './ForgotPasswordEmail';

const App = () => {
    return (
        <Router>
            <Routes>            
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/forgot-password-email/:userId" element={<ForgotPasswordEmail />} />

                {/*Exercise Monitoring  */}
                <Route path="/exercise-monitoring" element={<Layout component="exerciseMonitoring" />} />

                {/* User Managemnet  */}
                <Route path="/user-management" element={<Layout component="userManagement" />} />
                <Route path="/create-user" element={<Layout component="createUserAccount" />} />
                <Route path="/user-account-management/:userId" element={<Layout component="userAccountManagement" />} />


                <Route path="/appointments" element={<Layout component="appointments" />} />
                <Route path="/treatment-management" element={<Layout component="treatmentManagement" />} />
                <Route path="/create-treatment" element={<Layout component="createTreatment" />} /> 
                <Route path="/make-appointment" element={<Layout component="makeAppointment" />} />
                
                <Route path="/user-account/:username" element={<Layout component="userAccountPage" />} />

            </Routes>
        </Router>
    );
};

export default App;
