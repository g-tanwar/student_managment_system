const Notice = require('../models/Notice');
const ApiError = require('../utils/ApiError');
const BaseRepository = require('../repositories/BaseRepository');

const noticeRepository = new BaseRepository(Notice);

const createNotice = async (data, userId) => {
  if (data.publishDate && new Date(data.expiryDate) < new Date(data.publishDate)) {
    throw new ApiError(400, 'Expiry date mathematically cannot occur before Publish Date');
  } else if (!data.publishDate && new Date(data.expiryDate) < new Date()) {
    throw new ApiError(400, 'Expiry date mathematically cannot occur in the past');
  }

  return await noticeRepository.create({ ...data, createdBy: userId });
};

const getNotices = async (query) => {
  const { page = 1, limit = 10, audience, status } = query;
  const skip = (page - 1) * limit;

  const filter = {};
  
  if (status) filter.status = status;

  // Crucial: A filter finding ALL and specifically assigning it out to groups. 
  // If audience is requested (e.g. 'STUDENTS'), it grabs 'STUDENTS' targeted ones AND generalized 'ALL' broadcast ones
  if (audience) {
      filter.audience = { $in: [audience, 'ALL'] };
  }

  const notices = await noticeRepository.find(filter)
    .populate('createdBy', 'email role')
    .skip(Number(skip))
    .limit(Number(limit))
    .sort({ publishDate: -1 });

  const total = await noticeRepository.count(filter);

  return { notices, pagination: { total, page: Number(page), limit: Number(limit) } };
};

const getNoticeById = async (id) => {
  const notice = await noticeRepository.findById(id).populate('createdBy', 'email role');
  if (!notice) throw new ApiError(404, 'Notice message block not found');
  return notice;
};

const updateNotice = async (id, data) => {
  const notice = await noticeRepository.updateById(id, data, { new: true, runValidators: true });
  if (!notice) throw new ApiError(404, 'Notice message block not found');
  return notice;
};

const deleteNotice = async (id) => {
  const notice = await noticeRepository.deleteById(id);
  if (!notice) throw new ApiError(404, 'Notice message block not found');
  return true;
};

module.exports = { createNotice, getNotices, getNoticeById, updateNotice, deleteNotice };
