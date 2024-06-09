const BusinessModel = require('../../models/Business/BusinessModel');
const RoleModel = require('../../models/Role/RoleModel');


exports.addBusiness = async (req, res) => {
    try {
        const { name, contactNumber, ...restBody } = req.body;
        const email = req.headers["email"]; 
        const businessData = { ...restBody, name, contactNumber, email };
        const createdBusiness = await BusinessModel.create(businessData);
        
     

        const roleData = {
            name: "admin",
            businessID: createdBusiness._id,
            isDefault: 1,
        };
        const createdRole = await RoleModel.create(roleData);

 
        res.status(201).json({
            status: "Success",
            message: "Business and Role Created Successfully",
            business: createdBusiness,
            role: createdRole
        });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ status: "Fail", message: err.message });
    }
};
