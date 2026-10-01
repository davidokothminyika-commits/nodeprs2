export const logout = (req, res) => {
    res.clearCookie('token');

    res.json({
        success: true,
        message: "Logged out successfully"
    });
}