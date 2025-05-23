import { Request, Response } from "express";
import { ResearchModel } from "../models/ResearchModel";
import { SectionModel } from "../models/SectionModel";
import { IssueModel } from "../models/IssueModel";

export const getResearchesByIssue = async (req: Request, res: Response): Promise<void> => {
  try {
    const { issue } = req.params;

    const researches = await ResearchModel.find({ issue }).populate("issue");

    if (!researches.length) {
      res.status(404).json({ message: `No researches found for issue ID "${issue}"` });
      return;
    }

    res.status(200).json({ researches });
  } catch (error) {
    console.error("Error fetching researches by issue:", error);
    res.status(500).json({ message: "Error fetching researches by issue", error });
  }
};

export const getResearchById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const research = await ResearchModel.findById(id).populate("issue");

    if (!research) {
      res.status(404).json({ message: "Research not found" });
      return;
    }

    res.status(200).json({ research });
  } catch (error) {
    console.error("Error fetching research by ID:", error);
    res.status(500).json({ message: "Error fetching research by ID", error });
  }
};

export const createResearch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { section, title, authors, description, keywords, date } = req.body;
    console.log(req.body);
    
    if (!section || !title) {
      res.status(400).json({ message: "Section and title are required" });
      return;
    }

    const maxIndexResearch: any = await ResearchModel.findOne({ section })
      .sort({ index: -1 })
      .select('index');
    
    const nextIndex = maxIndexResearch ? maxIndexResearch.index + 1 : 0;

    const newResearch = new ResearchModel({
      section,
      title,
      authors,
      description,
      keywords,
      index: nextIndex,
      date: date || Date.now(),
    });

    await newResearch.save();

    res.status(201).json({ message: "Research created successfully", research: newResearch });
  } catch (error) {
    console.error("Error creating research:", error);
    res.status(500).json({ message: "Error creating research", error });
  }
};

export const updateResearch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, authors, description, keywords } = req.body;

    const updatedResearch = await ResearchModel.findByIdAndUpdate(
      id,
      { title, authors, description, keywords },
      { new: true }
    );

    if (!updatedResearch) {
      res.status(404).json({ message: "Research not found" });
      return;
    }

    res.status(200).json({ message: "Research updated successfully", research: updatedResearch });
  } catch (error) {
    console.error("Error updating research:", error);
    res.status(500).json({ message: "Error updating research", error });
  }
};

export const deleteResearch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const researchToDelete = await ResearchModel.findById(id);
    if (!researchToDelete) {
      res.status(404).json({ message: "Research not found" });
      return;
    }

    const { section, index } = researchToDelete;

    await ResearchModel.findByIdAndDelete(id);

    await ResearchModel.updateMany(
      { section, index: { $gt: index } },
      { $inc: { index: -1 } }
    );

    res.status(200).json({ message: "Research deleted successfully" });
  } catch (error) {
    console.error("Error deleting research:", error);
    res.status(500).json({ message: "Error deleting research", error });
  }
};

export const reorderResearch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { newIndex, newSection } = req.body;

    if (typeof newIndex !== 'number') {
      res.status(400).json({ message: "newIndex must be a number" });
      return;
    }

    const research = await ResearchModel.findById(id);
    if (!research) {
      res.status(404).json({ message: "Research not found" });
      return;
    }

    const oldSection: any = research.section;
    const oldIndex: any = research.index;
    if (!newSection || newSection.toString() === oldSection.toString()) {
      if (newIndex === oldIndex) {
        res.status(200).json({ message: "No change needed", research });
        return;
      }

      if (newIndex > oldIndex) {
        await ResearchModel.updateMany(
          { 
            section: oldSection, 
            index: { $gt: oldIndex, $lte: newIndex },
            _id: { $ne: id }
          },
          { $inc: { index: -1 } }
        );
      } else {
        await ResearchModel.updateMany(
          { 
            section: oldSection, 
            index: { $gte: newIndex, $lt: oldIndex },
            _id: { $ne: id }
          },
          { $inc: { index: 1 } }
        );
      }

      research.index = newIndex;
      await research.save();

    } else {
      const sectionExists = await SectionModel.findById(newSection);
      if (!sectionExists) {
        res.status(404).json({ message: "Target section not found" });
        return;
      }

      const researchCountInNewSection = await ResearchModel.countDocuments({ section: newSection });
      const validatedNewIndex = Math.min(newIndex, researchCountInNewSection);

      await ResearchModel.updateMany(
        { section: oldSection, index: { $gt: oldIndex } },
        { $inc: { index: -1 } }
      );

      await ResearchModel.updateMany(
        { section: newSection, index: { $gte: validatedNewIndex } },
        { $inc: { index: 1 } }
      );

      research.section = newSection;
      research.index = validatedNewIndex;
      await research.save();
    }

    const updatedResearch = await ResearchModel.findById(id).populate({
      path: "section",
      populate: {
        path: "issue",
        model: "Issue"
      }
    });

    res.status(200).json({ 
      message: "Research reordered successfully", 
      research: updatedResearch 
    });

  } catch (error) {
    console.error("Error reordering research:", error);
    res.status(500).json({ message: "Error reordering research", error });
  }
};

export const getResearchesBySection = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sectionId } = req.params;

    const researches = await ResearchModel.find({ section: sectionId })
      .sort({ index: 1 })
      .populate({
        path: "section",
        populate: {
          path: "issue",
          model: "Issue"
        }
      });

    res.status(200).json({ researches });
  } catch (error) {
    console.error("Error fetching researches by section:", error);
    res.status(500).json({ message: "Error fetching researches by section", error });
  }
};

export const search = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query, category } = req.query;
    console.log("Query:", query);
    console.log("Category:", category);

    if (!query) {
      res.status(400).json({ message: "Query parameter is required" });
      return;
    }

    const researchSearchConditions: any = {
      $or: [
        { title: { $regex: query, $options: "i" } },
        { authors: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { keywords: { $regex: query, $options: "i" } },
      ],
    };

    const issueSearchConditions: any = {
      $or: [
        { title: { $regex: query, $options: "i" } },
        { editors: { $regex: query, $options: "i" } },
      ],
    };

    if (category && ["linguistic", "literature", "foreign_literature"].includes(category as string)) {
      const issuesWithCategory = await IssueModel.find({ category: category }).select('_id');
      const issueIds = issuesWithCategory.map(issue => issue._id);

      const sectionsWithCategory = await SectionModel.find({
        issue: { $in: issueIds }
      }).select('_id');

      const sectionIds = sectionsWithCategory.map(section => section._id);

      researchSearchConditions.section = { $in: sectionIds };
      issueSearchConditions._id = { $in: issueIds };
    }

    const [researches, issues] = await Promise.all([
      ResearchModel.find(researchSearchConditions)
        .sort({ index: 1 })
        .populate({
          path: "section",
          populate: {
            path: "issue",
            model: "Issue"
          }
        }),
      IssueModel.find(issueSearchConditions)
    ]);

    res.status(200).json({ researches, issues });

  } catch (error) {
    console.error("Error searching:", error);
    res.status(500).json({ message: "Error searching", error });
  }
};