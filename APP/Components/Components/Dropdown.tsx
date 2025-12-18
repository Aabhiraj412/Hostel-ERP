import React, { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";

const Dropdown = ({ value, setValue, items, placeholder }) => {
	const [open, setOpen] = useState(false); // State to manage dropdown visibility

	return (
		<DropDownPicker
			open={open}
			value={value}
			items={items}
			setOpen={setOpen}
			setValue={setValue}
			placeholder={placeholder}
			style={styles.dropdown} // Style for the dropdown
			dropDownContainerStyle={styles.dropdownContainer} // Style for the dropdown list
			placeholderStyle={styles.placeholderStyle} // Placeholder text styling
			containerStyle={styles.container} // Style for the dropdown container
			listMode="SCROLLVIEW" // Use scrollable dropdown list
		/>
	);
};

const styles = {
	container: {
		width: "100%" as const,
		marginVertical: 10,
	},
	dropdown: {
		width: "100%" as const,
		borderColor: "#ccc",
		borderWidth: 1,
		borderRadius: 8,
		paddingHorizontal: 10,
	},
	dropdownContainer: {
		width: "100%" as const,
	},
	placeholderStyle: {
		color: "#aaa",
	},
};

export default Dropdown;
