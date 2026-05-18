import { Request, Response } from 'express';
import { Lead } from '../models/Lead';

export const getLeads = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || '';
    const status = (req.query.status as string) || '';
    const source = (req.query.source as string) || '';

    const query: any = {};
    if (search) query.name = { $regex: search, $options: 'i' };
    if (status) query.status = status;
    if (source) query.source = source;

    const total = await Lead.countDocuments(query);
    const leads = await Lead.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, total, page, limit, leads });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve pipeline data tracks.' });
  }
};

export const createLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const newLead = new Lead(req.body);
    await newLead.save();
    res.status(201).json({ success: true, lead: newLead });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Data formatting error creating pipeline records.' });
  }
};

export const updateLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedLead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedLead) {
      res.status(404).json({ success: false, message: 'Pipeline document target not found.' });
      return;
    }
    res.status(200).json({ success: true, lead: updatedLead });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to update pipeline variables.' });
  }
};

export const deleteLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedLead = await Lead.findByIdAndDelete(req.params.id);
    if (!deletedLead) {
      res.status(404).json({ success: false, message: 'Pipeline document target not found.' });
      return;
    }
    res.status(200).json({ success: true, message: 'Pipeline trace purged successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal engine fault clearing record.' });
  }
};