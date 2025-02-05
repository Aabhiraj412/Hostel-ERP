import { model, Schema } from "mongoose";

const AttendanceSchema = new Schema(
	{
		hostler: [
			{
				type: Schema.Types.ObjectId,
				ref: "Hostler",
			},
		],
	},
	{ timestamps: true }
);

const Attendance = model("Attendance", AttendanceSchema);

export default Attendance;