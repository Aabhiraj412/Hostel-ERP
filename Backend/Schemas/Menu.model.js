import mongoose from "mongoose";

const MenuSchema = new mongoose.Schema(
	{
		menu: {
			type: Buffer, // Store binary data
			required: true,
		},
		contentType: {
			type: String, // Store the MIME type of the file
			required: true,
		},
	},
	{
		timestamps: true, // Automatically add createdAt and updatedAt fields
	}
);

const Menu = mongoose.model("Menu", MenuSchema);
export default Menu;
