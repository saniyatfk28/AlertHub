import UserModel from "../Models/userModel.js";
import bcrypt from "bcrypt";

// Registering a new User
export const registerUser = async (req, res) => {
  console.log("Register request body:", req.body);
  const { username, password, firstname, lastname, email, address } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(password, salt);

  const newUser = new UserModel({
    username,
    password: hashedPass,
    firstname,
    lastname,
    email,
    address,
  });

  try {
    await newUser.save();
    console.log("User saved successfully:", newUser);
    res.status(200).json(newUser);
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ message: error.message });
  }
};


// login User

export const loginUser = async (req, res) => {
    const {username, password} = req.body

    try {
        const user = await UserModel.findOne({username: username})

        if(user)
        {
            const validity = await bcrypt.compare(password, user.password)

            validity? res.status(200).json(user): res.status(401).json("Not authorized")
        }
        else{
            res.status(404).json("User does not exists")
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
