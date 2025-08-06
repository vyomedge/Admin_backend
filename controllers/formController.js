const getPanelDb = require("../config/dbManager");

exports.createFormSubmission = async (req, res) => {
  try {
    const { panel } = req.params;
    console.log(panel)
    const { inqueryform } = getPanelDb(panel);
    const formData = req.body;
    const form = await inqueryform(formData);
    await form.save();

    res.status(201).json({ message: "Form submitted successfully!" });
  } catch (err) {
    res.status(400).json({ message: "Submission failed", error: err.message });
  }
};

// // GET /api/forms
// exports.getAllForms = async (req, res) => {
//   try {
//     const forms = await FormSubmission.find().sort({ createdAt: -1 });
//     res.status(200).json(forms);
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: "Failed to fetch forms", error: err.message });
//   }
// };
