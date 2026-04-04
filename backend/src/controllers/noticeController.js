const noticeService = require('../services/noticeService');

const createNotice = async (req, res, next) => {
  try {
    const notice = await noticeService.createNotice(req.body, req.user.id);
    res.status(201).json({ success: true, data: notice });
  } catch (error) {
    next(error);
  }
};

const getNotices = async (req, res, next) => {
  try {
    const data = await noticeService.getNotices(req.query);
    res.status(200).json({ success: true, count: data.notices.length, data: data.notices, pagination: data.pagination });
  } catch (error) {
    next(error);
  }
};

const getNotice = async (req, res, next) => {
  try {
    const notice = await noticeService.getNoticeById(req.params.id);
    res.status(200).json({ success: true, data: notice });
  } catch (error) {
    next(error);
  }
};

const updateNotice = async (req, res, next) => {
  try {
    const notice = await noticeService.updateNotice(req.params.id, req.body);
    res.status(200).json({ success: true, data: notice });
  } catch (error) {
    next(error);
  }
};

const deleteNotice = async (req, res, next) => {
  try {
    await noticeService.deleteNotice(req.params.id);
    res.status(200).json({ success: true, message: 'Notice successfully vaporized' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createNotice, getNotices, getNotice, updateNotice, deleteNotice };
