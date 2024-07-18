import User from '../models/userModel.js';

export const addFriends = async (req, res) => {
  try {
    const {  friendId } = req.body;
    console.log('friendId: ', friendId);

    if ( !friendId) {
        return res.status(200).json({success:false, message: "please provide friend's id" });
      }
    const user = await User.findById(req.user?._id);
    const friend = await User.findById(friendId);
    console.log('friend: ', friend);

    

    if (user.friends.includes(friendId)) {
    console.log('user.friends: ', user.friends);
      return res.status(200).json({success:false, message: 'Friend already added' });
    }

    user.friends.push(friendId);
    await user.save();

    res.status(200).json({ success:true,
        message:`${friend.name} is added to your friend list` });
  } catch (error) {
    console.log('error: ', error);
    res.status(500).json({success:false, message: 'Internal Server Error' });
  }
};



export const getFriendList = async (req, res) => {
  try {
    

    const user = await User.findById(req.user._id).populate('friends' ,'name')
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: 'User not found'
      });
    }
return res.send(user)
    const friendList = user.friends.map(friend => ({
      id: friend._id,
      name: friend.name
    }));

    return res.status(200).json({
      success: true,
      message: 'Friend list fetched successfully',
      friends: friendList
    });
  } catch (err) {
    console.error('Error fetching friend list:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: 'Server error'
    });
  }
};





export const getFriendSuggestion = async (req, res) => {
  try {
    const userId = req.user._id;

    const users = await User.find({ _id: { $ne: userId } }).select('name  country profileimage');

    res.status(200).json({
      success: true,
      message: 'Friend suggestions fetched successfully',
      users
    });
  } catch (err) {
    console.error('Error fetching friend suggestions:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: 'Server error'
    });
  }
};