import User from '../models/userModel.js';
export const addFriends = async (req, res) => {
  try {
    const { friendId } = req.body;

    if (!friendId) {
      return res.status(200).json({ success: false, message: "Please provide friend's id" });
    }

    const user = await User.findById(req.user?._id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isFriendAlreadyAdded = user.friends.some(friend => friend.friendId?.toString() === friendId);

    if (isFriendAlreadyAdded) {
      return res.status(200).json({ success: false, message: 'Friend already added' });
    }

    user.friends.push({ friendId: friendId, isAccepted: false });
    await user.save();

    res.status(200).json({ success: true, message: 'Friend request sent' });
  } catch (error) {
    console.error('error: ', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const getFriendList = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'friends.friendId', 
      select: 'name profileimage country' 
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const friendList = user.friends.map(friend => ({
    
      _id: friend.friendId?._id,
      name: friend.friendId?.name,
      country: friend.friendId?.country,
      profileimage: friend.friendId?.profileimage
    }));

    return res.status(200).json({
      success: true,
      message: 'Friend list fetched successfully',
      friendlist: friendList
    });
  } catch (err) {
    console.error('Error fetching friend list:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message
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
      friendSuggestion:users
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

export const exploreFriends = async (req, res) => {
  try {
    const userId = req.user._id;

    const users = await User.find({ _id: { $ne: userId } }).select('name  country profileimage');

    res.status(200).json({
      success: true,
      message: 'explore new friends',
      explore:users
    });
  } catch (err) {
    console.error('Error exploring friend :', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: 'Server error'
    });
  }
};

