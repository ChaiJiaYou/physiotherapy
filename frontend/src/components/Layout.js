import React from 'react';
import Sidebar from './Sidebar';
import CreateUserAccount from './CreateUserAccount';
import UserManagement from './UserManagement';
import UserAccountPage from './UserAccountPage';
import AppointmentView from './AppointmentView';
import CreateTreatment from './CreateTreatment';
import MakeAppointment from './MakeAppointment';
import TreatmentManagement from './TreatmentManagement';
import UserAccountManagement from './UserAccountManagement';
import ExerciseMonitoring from './ExerciseMonitoring';

const Layout = ({ component }) => {

    const userRole = localStorage.getItem("role");

    const componentsMap = {
        createUserAccount: CreateUserAccount,
        userManagement: UserManagement,
        userAccountPage: UserAccountPage,
        appointments: AppointmentView,
        createTreatment: CreateTreatment,
        makeAppointment: MakeAppointment,
        treatmentManagement: TreatmentManagement,
        userAccountManagement: UserAccountManagement,
        exerciseMonitoring : ExerciseMonitoring,
    };
    
    const PageComponent = componentsMap[component] || UserManagement;

    return (
        <div style={styles.container}>
            <Sidebar />
            <div style={styles.content}>
                <PageComponent />
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        height: '100vh',
        width: '100vw', // Ensure the full viewport width is taken
    },
    content: {
        flexGrow: 1, // This ensures the content area takes up the rest of the space after the sidebar
        backgroundColor: '#fff',
        overflowY: 'auto', // Ensure content scrolls if it overflows
    },
};


export default Layout;
