const User = require('../models/User');
exports.profile = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).select(
            "-password -createdAt -updatedAt -isBanned"
        );
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        console.error("Profile fetch error:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, phone, address, bussinessName } = req.body;
        
        const updateData = {};

        if (name) updateData.name = name;
        if (phone) updateData.phone = phone;
        if (address) updateData.address = address;
        if (bussinessName && req.user.role === "seller") {
            updateData.bussinessName = bussinessName;
        }

        if (req.file && req.file.path) {
            updateData.profilePhoto = req.file.path;
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true }
        ).select("-password -createdAt -updatedAt -__v -isBanned");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Profile update error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};


// CHANGE password
exports.changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Both current and new passwords are required' });
        }

        const user = await User.findById(userId).select('+password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect current password' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();

        return res.status(200).json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
        console.error('Change password error:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
