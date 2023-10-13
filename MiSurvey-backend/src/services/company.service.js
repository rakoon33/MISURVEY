const { Company } = require('../models'); // Import the Company model

// Function to add a new company
const addCompany = async (companyData) => {
  try {
    // Create a new company record in the database
    const newCompany = await Company.create(companyData);
    
    // Return the newly created company
    return newCompany;
  } catch (error) {
    throw error; // Handle any errors that occur during the database operation
  }
};

module.exports = {
  addCompany,
};
