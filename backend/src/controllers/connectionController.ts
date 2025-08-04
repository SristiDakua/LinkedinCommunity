import { Response } from 'express';
import { Connection } from '../models/Connection.js';
import { User } from '../models/User.js';
import { AuthRequest } from '../middleware/auth.js';
import { validationResult } from 'express-validator';

// @desc    Send connection request
// @route   POST /api/connections/request/:userId
// @access  Private
export const sendConnectionRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const requesterId = (req.user! as any)._id;

    // Check if user exists
    const recipient = await User.findById(userId);
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is trying to connect to themselves
    if (requesterId.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot send connection request to yourself'
      });
    }

    // Check if connection already exists
    const existingConnection = await Connection.findOne({
      $or: [
        { requester: requesterId, recipient: userId },
        { requester: userId, recipient: requesterId }
      ]
    });

    if (existingConnection) {
      return res.status(400).json({
        success: false,
        message: 'Connection request already exists or you are already connected'
      });
    }

    // Create connection request
    const connection = await Connection.create({
      requester: requesterId,
      recipient: userId,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      data: connection,
      message: 'Connection request sent successfully'
    });
  } catch (error) {
    console.error('Send connection request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while sending connection request'
    });
  }
};

// @desc    Respond to connection request
// @route   PUT /api/connections/respond/:connectionId
// @access  Private
export const respondToConnectionRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { connectionId } = req.params;
    const { action } = req.body; // 'accept', 'decline', 'block'
    const userId = (req.user! as any)._id;

    const connection = await Connection.findById(connectionId);

    if (!connection) {
      return res.status(404).json({
        success: false,
        message: 'Connection request not found'
      });
    }

    // Check if user is the recipient
    if (connection.recipient.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to respond to this connection request'
      });
    }

    // Check if request is pending
    if (connection.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Connection request has already been processed'
      });
    }

    // Update connection status
    connection.status = action;
    await connection.save();

    // If accepted, update connection counts
    if (action === 'accepted') {
      await User.findByIdAndUpdate(connection.requester, { $inc: { connections: 1 } });
      await User.findByIdAndUpdate(connection.recipient, { $inc: { connections: 1 } });
    }

    res.status(200).json({
      success: true,
      data: connection,
      message: `Connection request ${action} successfully`
    });
  } catch (error) {
    console.error('Respond to connection request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while responding to connection request'
    });
  }
};

// @desc    Get user connections
// @route   GET /api/connections/my-connections
// @access  Private
export const getMyConnections = async (req: AuthRequest, res: Response) => {
  try {
    const userId = (req.user! as any)._id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const connections = await Connection.find({
      $or: [
        { requester: userId, status: 'accepted' },
        { recipient: userId, status: 'accepted' }
      ]
    })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Connection.countDocuments({
      $or: [
        { requester: userId, status: 'accepted' },
        { recipient: userId, status: 'accepted' }
      ]
    });

    res.status(200).json({
      success: true,
      data: connections,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get connections error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching connections'
    });
  }
};

// @desc    Get pending connection requests
// @route   GET /api/connections/requests
// @access  Private
export const getPendingRequests = async (req: AuthRequest, res: Response) => {
  try {
    const userId = (req.user! as any)._id;
    
    const requests = await Connection.find({
      recipient: userId,
      status: 'pending'
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: requests
    });
  } catch (error) {
    console.error('Get pending requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching pending requests'
    });
  }
};

// @desc    Remove connection
// @route   DELETE /api/connections/:connectionId
// @access  Private
export const removeConnection = async (req: AuthRequest, res: Response) => {
  try {
    const { connectionId } = req.params;
    const userId = (req.user! as any)._id;

    const connection = await Connection.findById(connectionId);

    if (!connection) {
      return res.status(404).json({
        success: false,
        message: 'Connection not found'
      });
    }

    // Check if user is part of this connection
    if (
      connection.requester.toString() !== userId.toString() &&
      connection.recipient.toString() !== userId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to remove this connection'
      });
    }

    // Update connection counts if connection was accepted
    if (connection.status === 'accepted') {
      await User.findByIdAndUpdate(connection.requester, { $inc: { connections: -1 } });
      await User.findByIdAndUpdate(connection.recipient, { $inc: { connections: -1 } });
    }

    await connection.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Connection removed successfully'
    });
  } catch (error) {
    console.error('Remove connection error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while removing connection'
    });
  }
};
