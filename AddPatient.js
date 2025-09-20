// "use client";

// import { useState, useRef, useEffect, use } from "react";
// import { useNavigate } from "react-router-dom";
// import { patientService } from "../../services/api";
// import { authService } from "../../services/api";

// import { BsCalendar3 } from "react-icons/bs";
// import { toast } from "react-toastify";
// import "./AddPatient.css";
// import { toFormData } from "axios";

// const AddPatientForm = () => {
//   const navigate = useNavigate();

//   // Updated patient state with new fields
//   const [patient, setPatient] = useState({
//     firstName: "",
//     lastName: "",
//     dateOfBirth: "",
//     contact: "",
//     gender: "",
//     diabetesType: "",
//     description: "",
//   });

//   const [errors, setErrors] = useState({});
//   const [touched, setTouched] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Reference for auto-resizing textarea
//   const descriptionRef = useRef(null);

//   // Auto-resize textarea when content changes
//   useEffect(() => {
//     if (descriptionRef.current) {
//       descriptionRef.current.style.height = "auto";
//       descriptionRef.current.style.height = `${Math.max(
//         100,
//         descriptionRef.current.scrollHeight
//       )}px`;
//     }
//   }, [patient.description]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setPatient((prev) => ({ ...prev, [name]: value }));
//     // Clear error if value now valid
//     if (errors[name]) validateField(name, value);
//   };

//   const handleKeyPress = (e) => {
//     const { name } = e.target;
//     const char = e.key;

//     if (name === "firstName" || name === "lastName") {
//       if (!/^[A-Za-z\s]$/.test(char)) {
//         e.preventDefault();
//         setTouched((prev) => ({ ...prev, [name]: true }));
//         setErrors((prev) => ({ ...prev, [name]: "Only letters allowed" }));
//       }
//     }

//     if (name === "contact") {
//       if (!/^[0-9+\-() ]$/.test(char)) {
//         e.preventDefault();
//         setTouched((prev) => ({ ...prev, contact: true }));
//         setErrors((prev) => ({
//           ...prev,
//           contact: "Only numbers, +, -, (, ) and spaces allowed",
//         }));
//       }
//     }
//   };

//   const handleBlur = (e) => {
//     const { name, value } = e.target;
//     setTouched((prev) => ({ ...prev, [name]: true }));
//     validateField(name, value);
//   };
//   const [currentUser, setCurrentUser] = useState(null);

//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await authService.getCurrentUser();
//         setCurrentUser(res.data);
//       } catch (err) {
//         console.error("Could not fetch current user:", err);
//       }
//     })();
//   }, []);

//   const validateField = (name, value) => {
//     const newErrors = { ...errors };
//     switch (name) {
//       case "firstName":
//         if (!value.trim()) newErrors.firstName = "First name is required";
//         else if (!/^[A-Za-z\s]+$/.test(value))
//           newErrors.firstName = "Only letters allowed";
//         else if (value.length < 2) newErrors.firstName = "Too short";
//         else delete newErrors.firstName;
//         break;
//       case "lastName":
//         if (!value.trim()) newErrors.lastName = "Last name is required";
//         else if (!/^[A-Za-z\s]+$/.test(value))
//           newErrors.lastName = "Only letters allowed";
//         else if (value.length < 2) newErrors.lastName = "Too short";
//         else delete newErrors.lastName;
//         break;
//       case "dateOfBirth":
//         if (!value) {
//           newErrors.dateOfBirth = "Date of birth is required";
//         } else {
//           const dob = new Date(value);
//           const today = new Date();

//           // Remove time part
//           const dobDateOnly = new Date(
//             dob.getFullYear(),
//             dob.getMonth(),
//             dob.getDate()
//           );
//           const todayDateOnly = new Date(
//             today.getFullYear(),
//             today.getMonth(),
//             today.getDate()
//           );

//           let age = today.getFullYear() - dob.getFullYear();
//           const monthDiff = today.getMonth() - dob.getMonth();
//           if (
//             monthDiff < 0 ||
//             (monthDiff === 0 && today.getDate() < dob.getDate())
//           ) {
//             age--;
//           }

//           if (dobDateOnly.getTime() === todayDateOnly.getTime()) {
//             newErrors.dateOfBirth = "Date cannot be today";
//           } else if (dob > today) {
//             newErrors.dateOfBirth = "Date cannot be in the future";
//           } else if (age < 0 || age > 120) {
//             newErrors.dateOfBirth = "Enter a valid age (0–120 years)";
//           } else {
//             delete newErrors.dateOfBirth;
//           }
//         }
//         break;
//       case "contact":
//         if (!value.trim())
//           newErrors.contact = "Contact information is required";
//         else if (value.length < 7) newErrors.contact = "Too short";
//         else if (!/^[0-9+\-() ]+$/.test(value))
//           newErrors.contact = "Invalid format";
//         else delete newErrors.contact;
//         break;

//       case "gender":
//         if (!value) newErrors.gender = "Gender is required";
//         else delete newErrors.gender;
//         break;
//       case "diabetesType":
//         if (!value) newErrors.diabetesType = "Type is required";
//         else delete newErrors.diabetesType;
//         break;
//       default:
//         break;
//     }
//     setErrors(newErrors);
//   };

//   const validateForm = () => {
//     // Mark all required fields as touched
//     const allTouched = {
//       firstName: true,
//       lastName: true,
//       dateOfBirth: true,
//       contact: true,
//       gender: true,
//       diabetesType: true,
//     };
//     setTouched(allTouched);

//     // Validate all required fields
//     const newErrors = {};

//     // First name
//     if (!patient.firstName?.trim())
//       newErrors.firstName = "First name is required";
//     else if (!/^[A-Za-z\s]+$/.test(patient.firstName))
//       newErrors.firstName = "Only letters allowed";
//     else if (patient.firstName.length < 2) newErrors.firstName = "Too short";

//     // Last name
//     if (!patient.lastName?.trim()) newErrors.lastName = "Last name is required";
//     else if (!/^[A-Za-z\s]+$/.test(patient.lastName))
//       newErrors.lastName = "Only letters allowed";
//     else if (patient.lastName.length < 2) newErrors.lastName = "Too short";

//     // Date of birth
//     if (!patient.dateOfBirth) {
//       newErrors.dateOfBirth = "Date of birth is required";
//     } else {
//       const dob = new Date(patient.dateOfBirth);
//       const today = new Date();

//       // Strip time for accurate comparison
//       const dobDateOnly = new Date(
//         dob.getFullYear(),
//         dob.getMonth(),
//         dob.getDate()
//       );
//       const todayDateOnly = new Date(
//         today.getFullYear(),
//         today.getMonth(),
//         today.getDate()
//       );

//       let age = today.getFullYear() - dob.getFullYear();
//       const monthDiff = today.getMonth() - dob.getMonth();
//       if (
//         monthDiff < 0 ||
//         (monthDiff === 0 && today.getDate() < dob.getDate())
//       ) {
//         age--;
//       }

//       if (dobDateOnly.getTime() === todayDateOnly.getTime()) {
//         newErrors.dateOfBirth = "Date cannot be today";
//       } else if (dob > today) {
//         newErrors.dateOfBirth = "Date cannot be in the future";
//       } else if (age < 0 || age > 120) {
//         newErrors.dateOfBirth = "Enter a valid age (0–120 years)";
//       }
//     }

//     // Contact
//     if (!patient.contact?.trim())
//       newErrors.contact = "Contact information is required";
//     else if (patient.contact.length < 7) newErrors.contact = "Too short";
//     else if (!/^[0-9+\-() ]+$/.test(patient.contact))
//       newErrors.contact = "Invalid format";

//     // Gender
//     if (!patient.gender) newErrors.gender = "Gender is required";

//     // Diabetes type
//     if (!patient.diabetesType) newErrors.diabetesType = "Type is required";

//     // Set errors and return form validity
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // If validation passes
//     if (validateForm()) {
//       setIsSubmitting(true);
//       try {
//         // Decide doctor assignment here
//         const assigned =
//           currentUser.role === "staff"
//             ? currentUser.assignedDoctor
//             : currentUser._id;
//         console.log("Assigned doctor ID:", assigned); // Debugging line
//         // Send data to the backend
//         const payload = {
//           firstName: patient.firstName,
//           lastName: patient.lastName,
//           dateOfBirth: patient.dateOfBirth,
//           contact: patient.contact,
//           gender: patient.gender,
//           diabetesType: patient.diabetesType,
//           description: patient.description,
//           assignedDoctor: assigned,
//         };
//         await patientService.createPatient(payload);

//         toast.success("Patient added successfully!");
//         setPatient({
//           firstName: "",
//           lastName: "",
//           dateOfBirth: "",
//           contact: "",
//           gender: "",
//           diabetesType: "",
//           description: "",
//         });
//         setErrors({});
//         setTouched({});

//         // Navigate to dashboard
//         navigate("/dashboard");
//       } catch (error) {
//         console.error("Error adding patient:", error);
//         toast.error("Failed to add patient. Please try again.");
//       }
//       setIsSubmitting(false);
//     }
//   };

//   const handleClear = () => {
//     setPatient({
//       firstName: "",
//       lastName: "",
//       dateOfBirth: "",
//       contact: "",
//       gender: "",
//       diabetesType: "",
//       description: "",
//     });
//     setErrors({});
//     setTouched({});
//   };

//   return (
//     <div className="container-fluid">
//       <div className="row mt-4">
//         <div className="col-12">
//           <div className="d-flex justify-content-between align-items-center mb-4 title-sectionAdd">
//             <h2 className="form-title">Add New Patient</h2>
//             <button
//               type="button"
//               className="btn btn-outline-secondary"
//               onClick={() => navigate("/dashboard")}
//             >
//               Cancel
//             </button>
//           </div>

//           {Object.keys(errors).length > 0 &&
//             Object.values(touched).some((t) => t) && (
//               <div className="validation-summary mb-4">
//                 <div className="validation-summary-title">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="16"
//                     height="16"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   >
//                     <circle cx="12" cy="12" r="10"></circle>
//                     <line x1="12" y1="8" x2="12" y2="12"></line>
//                     <line x1="12" y1="16" x2="12.01" y2="16"></line>
//                   </svg>
//                   Please correct the following errors:
//                 </div>
//                 <ul className="validation-summary-list">
//                   {Object.entries(errors).map(([field, message]) => (
//                     <li key={field}>{message}</li>
//                   ))}
//                 </ul>
//               </div>
//             )}

//           <div className="form-container">
//             <form onSubmit={handleSubmit} noValidate>
//               <div className="row mb-3">
//                 <div className="col-md-6">
//                   <label
//                     htmlFor="firstName"
//                     className="form-label required-field"
//                   >
//                     First Name
//                   </label>
//                   <input
//                     type="text"
//                     id="firstName"
//                     name="firstName"
//                     className={`form-control ${
//                       touched.firstName && errors.firstName ? "is-invalid" : ""
//                     }`}
//                     value={patient.firstName}
//                     onChange={handleChange}
//                     onKeyPress={handleKeyPress}
//                     onBlur={handleBlur}
//                   />
//                   {touched.firstName && errors.firstName && (
//                     <div className="invalid-feedback">{errors.firstName}</div>
//                   )}
//                 </div>
//                 <div className="col-md-6">
//                   <label
//                     htmlFor="lastName"
//                     className="form-label required-field"
//                   >
//                     Last Name
//                   </label>
//                   <input
//                     type="text"
//                     id="lastName"
//                     name="lastName"
//                     className={`form-control ${
//                       touched.lastName && errors.lastName ? "is-invalid" : ""
//                     }`}
//                     value={patient.lastName}
//                     onChange={handleChange}
//                     onKeyPress={handleKeyPress}
//                     onBlur={handleBlur}
//                   />
//                   {touched.lastName && errors.lastName && (
//                     <div className="invalid-feedback">{errors.lastName}</div>
//                   )}
//                 </div>
//               </div>

//               <div className="row mb-3">
//                 <div className="col-md-6">
//                   <label
//                     htmlFor="dateOfBirth"
//                     className="form-label required-field"
//                   >
//                     Date of Birth
//                   </label>
//                   <div className="date-input-container">
//                     <input
//                       type="date"
//                       id="dateOfBirth"
//                       name="dateOfBirth"
//                       className={`form-control ${
//                         touched.dateOfBirth && errors.dateOfBirth
//                           ? "is-invalid"
//                           : ""
//                       }`}
//                       value={patient.dateOfBirth}
//                       onChange={handleChange}
//                       onBlur={handleBlur}
//                       max={new Date().toISOString().split("T")[0]}
//                     />
//                     <BsCalendar3 className="calendar-icon" />
//                   </div>
//                   {touched.dateOfBirth && errors.dateOfBirth && (
//                     <div className="invalid-feedback">{errors.dateOfBirth}</div>
//                   )}
//                 </div>
//                 <div className="col-md-6">
//                   <label
//                     htmlFor="contact"
//                     className="form-label required-field"
//                   >
//                     Contact Information
//                   </label>
//                   <input
//                     type="text"
//                     id="contact"
//                     name="contact"
//                     className={`form-control ${
//                       touched.contact && errors.contact ? "is-invalid" : ""
//                     }`}
//                     value={patient.contact}
//                     onChange={handleChange}
//                     onKeyPress={handleKeyPress}
//                     onBlur={handleBlur}
//                     placeholder="e.g. (123) 456-7890"
//                   />
//                   {touched.contact && errors.contact && (
//                     <div className="invalid-feedback">{errors.contact}</div>
//                   )}
//                 </div>
//               </div>

//               <div className="row mb-3">
//                 <div className="col-md-6">
//                   <label htmlFor="gender" className="form-label required-field">
//                     Gender
//                   </label>
//                   <select
//                     id="gender"
//                     name="gender"
//                     className={`form-select ${
//                       touched.gender && errors.gender ? "is-invalid" : ""
//                     }`}
//                     value={patient.gender}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                   >
//                     <option value="">Select Gender</option>
//                     <option value="Male">Male</option>
//                     <option value="Female">Female</option>
//                     <option value="Other">Other</option>
//                   </select>
//                   {touched.gender && errors.gender && (
//                     <div className="invalid-feedback">{errors.gender}</div>
//                   )}
//                 </div>
//               </div>

//               <div className="row mb-3">
//                 <div className="col-md-6">
//                   <label
//                     htmlFor="diabetesType"
//                     className="form-label required-field"
//                   >
//                     Type of Diabetes
//                   </label>
//                   <select
//                     id="diabetesType"
//                     name="diabetesType"
//                     className={`form-select ${
//                       touched.diabetesType && errors.diabetesType
//                         ? "is-invalid"
//                         : ""
//                     }`}
//                     value={patient.diabetesType}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                   >
//                     <option value="">Select Type</option>
//                     <option value="Type 1">Type 1</option>
//                     <option value="Type 2">Type 2</option>
//                     <option value="Gestational">Gestational</option>
//                     <option value="MODY">MODY</option>
//                     <option value="LADA">LADA</option>
//                   </select>
//                   {touched.diabetesType && errors.diabetesType && (
//                     <div className="invalid-feedback">
//                       {errors.diabetesType}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="mb-3">
//                 <label htmlFor="description" className="form-label">
//                   Patient Description
//                 </label>
//                 <textarea
//                   ref={descriptionRef}
//                   id="description"
//                   name="description"
//                   className="form-control auto-resize-textarea"
//                   value={patient.description}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   placeholder="Enter any relevant medical history, current medications, or other important information about the patient."
//                 />
//               </div>

//               <div className="d-grid gap-2 d-md-flex justify-content-md-end">
//                 <button
//                   type="button"
//                   className="btn  clearform me-md-2"
//                   onClick={handleClear}
//                 >
//                   Clear Form
//                 </button>
//                 <button
//                   type="submit"
//                   className="btn btn-primary px-4"
//                   disabled={isSubmitting}
//                 >
//                   {isSubmitting ? "Adding..." : "Add Patient"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddPatientForm;

"use client";

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { patientService } from "../../services/api";
import { authService } from "../../services/api";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-phone-input-2/lib/style.css"; // ← import PhoneInput CSS
import PhoneInput from "react-phone-input-2"; // ← import the component
import emailjs from "@emailjs/browser";

import "./AddPatient.css";

const AddPatientForm = () => {
  const navigate = useNavigate();

  // Updated patient state with new fields
  const [patient, setPatient] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    contact: "", // ← Will store the phone-input value (digits only, no “+”)
    gender: "",
    diabetesType: "",
    description: "",
    email: "", // Added email field
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reference for auto-resizing textarea
  const descriptionRef = useRef(null);

  // Auto-resize textarea when content changes
  useEffect(() => {
    if (descriptionRef.current) {
      descriptionRef.current.style.height = "auto";
      descriptionRef.current.style.height = `${Math.max(
        100,
        descriptionRef.current.scrollHeight
      )}px`;
    }
  }, [patient.description]);
  const generatePassword = (length = 8) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return password;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // console.log("handleChange →", name, "=", value);
    setPatient((prev) => ({ ...prev, [name]: value }));
    // Clear error if value now valid
    if (errors[name]) validateField(name, value);
  };

  const handleKeyPress = (e) => {
    // We’ll still keep the name / lastName restrictions here.
    const { name } = e.target;
    const char = e.key;

    if (name === "firstName" || name === "lastName") {
      if (!/^[A-Za-z\s]$/.test(char)) {
        e.preventDefault();
        setTouched((prev) => ({ ...prev, [name]: true }));
        setErrors((prev) => ({ ...prev, [name]: "Only letters allowed" }));
      }
    }
    // We no longer need a key‐filter on contact, because PhoneInput only yields digits.
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        const res = await authService.getCurrentUser();
        setCurrentUser(res.data);
      } catch (err) {
        console.error("Could not fetch current user:", err);
      }
    })();
  }, []);

  const validateField = (name, value) => {
    // console.log("validateField →", name, "value:", value);
    const newErrors = { ...errors };

    switch (name) {
      case "firstName":
        // Guard against value being undefined/null
        if (!value || !value.trim()) {
          newErrors.firstName = "First name is required";
        } else if (!/^[A-Za-z\s]+$/.test(value)) {
          newErrors.firstName = "Only letters allowed";
        } else if (value.length < 2) {
          newErrors.firstName = "Too short";
        } else {
          delete newErrors.firstName;
        }
        break;

      case "lastName":
        if (!value || !value.trim()) {
          newErrors.lastName = "Last name is required";
        } else if (!/^[A-Za-z\s]+$/.test(value)) {
          newErrors.lastName = "Only letters allowed";
        } else if (value.length < 2) {
          newErrors.lastName = "Too short";
        } else {
          delete newErrors.lastName;
        }
        break;
      case "email":
        if (!value || !value.trim()) {
          newErrors.email = "Email is required";
        } else if (
          !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
        ) {
          newErrors.email = "Enter a valid email address";
        } else {
          delete newErrors.email;
        }
        break;

      case "dateOfBirth":
        if (!value) {
          newErrors.dateOfBirth = "Date of birth is required";
        } else {
          const dob = new Date(value);
          const today = new Date();

          // Remove time portion
          const dobDateOnly = new Date(
            dob.getFullYear(),
            dob.getMonth(),
            dob.getDate()
          );
          const todayDateOnly = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
          );

          let age = today.getFullYear() - dob.getFullYear();
          const monthDiff = today.getMonth() - dob.getMonth();
          if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < dob.getDate())
          ) {
            age--;
          }

          if (dobDateOnly.getTime() === todayDateOnly.getTime()) {
            newErrors.dateOfBirth = "Date cannot be today";
          } else if (dob > today) {
            newErrors.dateOfBirth = "Date cannot be in the future";
          } else if (age < 0 || age > 120) {
            newErrors.dateOfBirth = "Enter a valid age (0–120 years)";
          } else {
            delete newErrors.dateOfBirth;
          }
        }
        break;

      case "contact":
        // Guard: if value is undefined/null/empty, we treat as missing
        if (!value || !value.trim()) {
          newErrors.contact = "Contact is required";
        } else if (!/^[0-9]{7,15}$/.test(value)) {
          newErrors.contact = "Enter a valid phone number";
        } else {
          delete newErrors.contact;
        }
        break;

      case "gender":
        if (!value) {
          newErrors.gender = "Gender is required";
        } else {
          delete newErrors.gender;
        }
        break;

      case "diabetesType":
        if (!value) {
          newErrors.diabetesType = "Type is required";
        } else {
          delete newErrors.diabetesType;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
  };

  const validateForm = () => {
    // Mark all required fields as touched
    const allTouched = {
      firstName: true,
      lastName: true,
      dateOfBirth: true,
      contact: true,
      gender: true,
      diabetesType: true,
    };
    setTouched(allTouched);

    // Validate all required fields
    const newErrors = {};

    // First name
    if (!patient.firstName?.trim())
      newErrors.firstName = "First name is required";
    else if (!/^[A-Za-z\s]+$/.test(patient.firstName))
      newErrors.firstName = "Only letters allowed";
    else if (patient.firstName.length < 2) newErrors.firstName = "Too short";

    // Last name
    if (!patient.lastName?.trim()) newErrors.lastName = "Last name is required";
    else if (!/^[A-Za-z\s]+$/.test(patient.lastName))
      newErrors.lastName = "Only letters allowed";
    else if (patient.lastName.length < 2) newErrors.lastName = "Too short";

    // Date of birth
    if (!patient.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    } else {
      const dob = new Date(patient.dateOfBirth);
      const today = new Date();
      const dobDateOnly = new Date(
        dob.getFullYear(),
        dob.getMonth(),
        dob.getDate()
      );
      const todayDateOnly = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < dob.getDate())
      ) {
        age--;
      }
      if (dobDateOnly.getTime() === todayDateOnly.getTime()) {
        newErrors.dateOfBirth = "Date cannot be today";
      } else if (dob > today) {
        newErrors.dateOfBirth = "Date cannot be in the future";
      } else if (age < 0 || age > 120) {
        newErrors.dateOfBirth = "Enter a valid age (0–120 years)";
      }
    }

    // Contact
    if (!patient.contact?.trim()) newErrors.contact = "Contact is required";
    else if (!/^[0-9]{7,15}$/.test(patient.contact))
      newErrors.contact = "Enter a valid phone number";

    // Gender
    if (!patient.gender) newErrors.gender = "Gender is required";

    // Diabetes type
    if (!patient.diabetesType) newErrors.diabetesType = "Type is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);
      try {
        // Decide doctor assignment here
        const assigned =
          currentUser.role === "staff"
            ? currentUser.assignedDoctor
            : currentUser._id;

        const generatedPassword = generatePassword(10); // You can set the length as needed
        const serviceID = "service_oj59e2e"; // from EmailJS
        const templateID = "template_nj9t0fk"; // from EmailJS
        const publicKey = "aF_zsb2oMoZH5cl2E"; // from EmailJS

        const templateParams = {
          user_email: patient.email, // must match your EmailJS template
          password: generatedPassword, // must match your template variable
        };

        await emailjs.send(serviceID, templateID, templateParams, publicKey);
        // Build payload
        const payload = {
          firstName: patient.firstName,
          lastName: patient.lastName,
          dateOfBirth: patient.dateOfBirth,
          contact: patient.contact, // already digits only, country code included
          gender: patient.gender,
          diabetesType: patient.diabetesType,
          email: patient.email, // Added email to payload
          password: generatedPassword, // Include generated password

          description: patient.description,
          assignedDoctor: assigned,
        };
        console.log("Payload being sent:", payload); // Debugging line

        await patientService.createPatient(payload);
        // toast.success(
        //   `Patient added successfully! The generated password is: ${generatedPassword} and payload is : ${payload}`
        // );

        toast.success("Patient added successfully!");
        setPatient({
          firstName: "",
          lastName: "",
          dateOfBirth: "",
          contact: "",
          gender: "",
          diabetesType: "",
          description: "",
          email: "", // Reset email field after submit
        });
        setErrors({});
        setTouched({});

        // Navigate to dashboard
        // navigate("/dashboard");
      } catch (error) {
        console.error("Error adding patient:", error);
        toast.error("Failed to add patient. Please try again.");
      }
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    setPatient({
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      contact: "",
      gender: "",
      diabetesType: "",
      description: "",
    });
    setErrors({});
    setTouched({});
  };

  return (
    <div className="container-fluid">
      <div className="row mt-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4 title-sectionAdd">
            <h2 className="form-title">Add New Patient</h2>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </button>
          </div>

          {Object.keys(errors).length > 0 &&
            Object.values(touched).some((t) => t) && (
              <div className="validation-summary mb-4">
                <div className="validation-summary-title">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  Please correct the following errors:
                </div>
                <ul className="validation-summary-list">
                  {Object.entries(errors).map(([field, message]) => (
                    <li key={field}>{message}</li>
                  ))}
                </ul>
              </div>
            )}

          <div className="form-container">
            <form onSubmit={handleSubmit} noValidate>
              {/* ───── First & Last Name ───── */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <label
                    htmlFor="firstName"
                    className="form-label required-field"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className={`form-control ${
                      touched.firstName && errors.firstName ? "is-invalid" : ""
                    }`}
                    value={patient.firstName}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    onBlur={handleBlur}
                  />
                  {touched.firstName && errors.firstName && (
                    <div className="invalid-feedback">{errors.firstName}</div>
                  )}
                </div>
                <div className="col-md-6">
                  <label
                    htmlFor="lastName"
                    className="form-label required-field"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className={`form-control ${
                      touched.lastName && errors.lastName ? "is-invalid" : ""
                    }`}
                    value={patient.lastName}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    onBlur={handleBlur}
                  />
                  {touched.lastName && errors.lastName && (
                    <div className="invalid-feedback">{errors.lastName}</div>
                  )}
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="email" className="form-label required-field">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`form-control ${
                      touched.email && errors.email ? "is-invalid" : ""
                    }`}
                    value={patient.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.email && errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>
                <div className="col-md-6">
                  <label
                    htmlFor="dateOfBirth"
                    className="form-label required-field"
                  >
                    Date of Birth
                  </label>
                  <div className="date-input-container">
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      className={`form-control ${
                        touched.dateOfBirth && errors.dateOfBirth
                          ? "is-invalid"
                          : ""
                      }`}
                      value={patient.dateOfBirth}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      max={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  {touched.dateOfBirth && errors.dateOfBirth && (
                    <div className="invalid-feedback">{errors.dateOfBirth}</div>
                  )}
                </div>
              </div>

              {/* ───── Date of Birth & Contact ───── */}
              <div className="row mb-3">
                <div className="col-md-4">
                  <label
                    htmlFor="contact"
                    className="form-label required-field"
                  >
                    Contact Information
                  </label>

                  <PhoneInput
                    country={"pk"}
                    name="contact"
                    value={patient.contact}
                    onChange={(phone) => {
                      handleChange({
                        target: { name: "contact", value: phone },
                      });
                    }}
                    onBlur={() =>
                      // Pass current patient.contact here, not just { name }
                      handleBlur({
                        target: { name: "contact", value: patient.contact },
                      })
                    }
                    inputClass={
                      touched.contact && errors.contact
                        ? "form-control is-invalid"
                        : "form-control"
                    }
                    enableSearch
                    disableCountryCode={false}
                    disableDropdown={false}
                    countryCodeEditable={false}
                    placeholder="Enter phone number"
                  />

                  {touched.contact && errors.contact && (
                    <div className="invalid-feedback">{errors.contact}</div>
                  )}
                </div>
                <div className="col-md-4">
                  <label htmlFor="gender" className="form-label required-field">
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    className={`form-select ${
                      touched.gender && errors.gender ? "is-invalid" : ""
                    }`}
                    value={patient.gender}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {touched.gender && errors.gender && (
                    <div className="invalid-feedback">{errors.gender}</div>
                  )}
                </div>
                <div className="col-md-4">
                  <label
                    htmlFor="diabetesType"
                    className="form-label required-field"
                  >
                    Type of Diabetes
                  </label>
                  <select
                    id="diabetesType"
                    name="diabetesType"
                    className={`form-select ${
                      touched.diabetesType && errors.diabetesType
                        ? "is-invalid"
                        : ""
                    }`}
                    value={patient.diabetesType}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option value="">Select Type</option>
                    <option value="Type 1">Type 1</option>
                    <option value="Type 2">Type 2</option>
                    <option value="Gestational">Gestational</option>
                    <option value="MODY">MODY</option>
                    <option value="LADA">LADA</option>
                  </select>
                  {touched.diabetesType && errors.diabetesType && (
                    <div className="invalid-feedback">
                      {errors.diabetesType}
                    </div>
                  )}
                </div>
              </div>

              {/* ───── Diabetes Type ───── */}
              {/* <div className="row mb-3"></div> */}

              {/* ───── Description ───── */}
              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Patient Description
                </label>
                <textarea
                  ref={descriptionRef}
                  id="description"
                  name="description"
                  className="form-control auto-resize-textarea"
                  value={patient.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter any relevant medical history, current medications, or other important information about the patient."
                />
              </div>

              {/* ───── ACTION BUTTONS ───── */}
              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <button
                  type="button"
                  className="btn clearform me-md-2"
                  onClick={handleClear}
                >
                  Clear Form
                </button>
                <button
                  type="submit"
                  className="btn btn-primary px-4"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Adding..." : "Add Patient"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPatientForm;
