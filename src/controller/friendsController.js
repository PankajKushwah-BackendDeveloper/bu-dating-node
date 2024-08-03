import User from '../models/userModel.js';

export const sendFriendRequest = async (req, res) => {
  try {
    const { friendId } = req.body;

    if (!friendId) {
      return res.status(200).json({ success: false, message: "Please provide friend's id" });
    }

    const user = await User.findById(req.user?._id);
    console.log('req.user: ', req.user);
    
    if (!user) {
      return res.status(200).json({ success: false, message: "User not found" });
    }


    const friend = await User.findById(friendId);
    if (!friend) {
      return res.status(200).send({
        success: false,
        message: 'Friend user not found'
      });
    }
    if (friend.friendRequest.includes(friendId)) {
      return res.status(200).json({ success: false, message: 'Friend request already has been sent' });
    }

    friend.friendRequest.push(req.user._id);
    await user.save();

    res.status(200).json({ success: true, message: 'Friend request sent',friendRequests:friend.friendRequest });
  } catch (error) {
    console.error('error: ', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


export const getFriendRequests = async (req, res) => {
  try {
    const user = await User.findById(req.user?._id).populate({
      path: 'friendRequest',
      select: 'name profileimage' 
    });

    if (!user) {
      return res.status(200).send({
        success: false,
        message: 'No user found'
      });
    }

    return res.status(200).send({
      success: true,
      friendRequests: user.friendRequest
    });
  } catch (error) {
    console.log('error: ', error);
    return res.status(500).send({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const { friendId } = req.body;

    if (!friendId) {
      return res.status(200).send({
        success: false,
        message: 'Please provide the friend ID to accept the request'
      });
    }

    const user = await User.findById(req.user?._id);
    if (!user) {
      return res.status(200).send({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.friendRequest.includes(friendId)) {
      return res.status(200).send({
        success: false,
        message: 'Friend request not found'
      });
    }

    const friend = await User.findById(friendId);
    if (!friend) {
      return res.status(200).send({
        success: false,
        message: 'Friend user not found'
      });
    }

    user.friends.push(friendId);
    user.friendRequest = user.friendRequest.filter(id => id.toString() !== friendId.toString());
    console.log('user.friendRequest: ', user.friendRequest);

    friend.friends.push(user._id);

    await user.save();  
    await friend.save();  

    return res.status(200).send({
      success: true,
      message: 'Friend request accepted successfully'
    });
  } catch (error) {
    console.error('Error accepting friend request:', error);
    return res.status(500).send({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};



export const getFriendList = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'friends', 
      select: 'name profileimage country' 
    });

    console.log('user: ', user);
    if (!user) {
      return res.status(200).json({
        success: false,
        message: 'User not found'
      });
    }

    

    return res.status(200).json({
      success: true,
      message: 'Friend list fetched successfully',
      friendlist: user.friends
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

