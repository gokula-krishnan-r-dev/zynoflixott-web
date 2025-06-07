import mongoose from "mongoose";

const productionSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        cityState: {
            type: String,
            required: true,
        },
        shortFilmTitle: {
            type: String,
            required: true,
        },
        runtime: {
            type: String,
            required: true,
        },
        filmLanguage: {
            type: String,
            required: true,
        },
        isReleased: {
            type: String,
            required: true,
        },
        driveLink: {
            type: String,
            default: "",
        },
        synopsis: {
            type: String,
            required: true,
        },
        appointmentDate: {
            type: String,
            required: true,
        },
        appointmentTime: {
            type: String,
            required: true,
        },
        budget: {
            type: String,
            required: true,
        },
        rightsType: {
            type: String,
            required: true,
        },
        additionalNotes: {
            type: String,
            default: "",
        },
        posterUrl: {
            type: String,
            default: "",
        },
        originalFileName: {
            type: String,
            default: "",
        },
        paymentOrderId: {
            type: String,
            default: "",
        },
        paymentId: {
            type: String,
            default: "",
        },
        paymentSignature: {
            type: String,
            default: "",
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "completed", "failed"],
            default: "pending",
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
    },
    { timestamps: true }
);

// Check if the model already exists to prevent overwriting
const Production = mongoose.models.Production || mongoose.model("Production", productionSchema);

export default Production; 