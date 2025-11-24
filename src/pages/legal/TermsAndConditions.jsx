import React from 'react';
import { styles, termsData } from './PolicyDataAndStyles'; 
import Navbar from '../../components/Navbar'; // Assuming Navbar component

// Reusable component for each policy section
const PolicySection = ({ title, content }) => (
    <div style={styles.section}>
        <h3 style={styles.sectionTitle}>{title}</h3>
        <p style={styles.sectionContent}>{content}</p>
    </div>
);

const TermsAndConditions = () => {
    return (
        // Use a Fragment (<>) to return multiple top-level elements (Navbar and main div)
        <> 
            <Navbar/> 
            <div style={styles.container}>
                <header style={styles.header}>
                    <h1 style={styles.mainTitle}>Plattr Policy Center</h1>
                </header>

                <div style={styles.contentArea}>
                    <h2 style={styles.policyTitle}>{termsData.title}</h2>
                    <p style={styles.updateDate}>{termsData.lastUpdated}</p>

                    {termsData.sections.map((section, index) => (
                        <PolicySection 
                            key={index} 
                            title={section.title} 
                            content={section.content} 
                        />
                    ))}
                </div>

                <footer style={styles.footer}>
                    <p>&copy; {new Date().getFullYear()} Plattr. All rights reserved.</p>
                </footer>
            </div>
        </>
    );
};

export default TermsAndConditions;