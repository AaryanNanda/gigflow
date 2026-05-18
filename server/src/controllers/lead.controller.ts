import { Response, NextFunction } from 'express';
import { Lead } from '../models/Lead';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

// @desc    Create a new lead
// @route   POST /api/leads
export const createLead = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, status, source } = req.body;

    const lead = await Lead.create({
      name,
      email,
      status,
      source
    });

    res.status(201).json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all leads with Advanced Filtering, Search & Pagination
// @route   GET /api/leads
export const getLeads = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, source, search, sort, page = 1, limit = 10 } = req.query;

    // 1. Build Dynamic Filter Query Object
    const query: any = {};
    
    if (status) query.status = status;
    if (source) query.source = source;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // 2. Set Up Sorting Options
    let sortOptions: any = { createdAt: -1 }; // default: Latest
    if (sort === 'oldest') sortOptions = { createdAt: 1 };

    // 3. Execution of Pagination Math
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const totalRecords = await Lead.countDocuments(query);
    const leads = await Lead.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      data: leads,
      pagination: {
        totalRecords,
        currentPage: pageNum,
        totalPages: Math.ceil(totalRecords / limitNum),
        hasNextPage: skip + leads.length < totalRecords
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single lead details
// @route   GET /api/leads/:id
export const getLeadById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      res.status(404).json({ success: false, message: 'Lead not found' });
      return;
    }
    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a lead
// @route   PUT /api/leads/:id
export const updateLead = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!lead) {
      res.status(404).json({ success: false, message: 'Lead not found' });
      return;
    }

    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a lead
// @route   DELETE /api/leads/:id
export const deleteLead = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      res.status(404).json({ success: false, message: 'Lead not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Lead removed successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Export filtered leads to CSV format
// @route   GET /api/leads/export
export const exportLeadsCSV = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, source, search } = req.query;

    // Apply the exact same active dashboard filters to the export query
    const query: any = {};
    if (status) query.status = status;
    if (source) query.source = source;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const leads = await Lead.find(query).sort({ createdAt: -1 });

    // Generate CSV string representation manually to maintain lightweight type compliance
    const headers = 'ID,Name,Email,Status,Source,CreatedAt\n';
    const rows = leads.map(lead => 
      `"${lead._id}","${lead.name}","${lead.email}","${lead.status}","${lead.source}","${lead.createdAt}"`
    ).join('\n');

    const csvData = headers + rows;

    // Stream download directly back to client
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads_export.csv');
    res.status(200).send(csvData);
  } catch (error) {
    next(error);
  }
};