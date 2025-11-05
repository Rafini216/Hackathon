const Group = require("../models/Group");
const User = require("../models/User");

const createGroup = async (req, res) => {
  try {
    const { name, description, members } = req.body;

    if (!name) {
      return res.status(400).json({
        message: 'Nome do grupo é obrigatório'
      });
    }

    const group = await Group.create({
      name,
      description,
      members: members || [],
      createdBy: req.body.createdBy || null
    });

    const populatedGroup = await Group.findById(group._id)
      .populate("members", "name email")
      .populate("createdBy", "name email");

    return res.status(201).json({
      message: 'Grupo criado com sucesso',
      group: populatedGroup
    });
  } catch (err) {
    console.error('Erro ao criar grupo:', err);
    return res.status(500).json({
      message: 'Erro ao criar grupo'
    });
  }
};

const getGroups = async (req, res) => {
  try {
    const groups = await Group.find()
      .populate("members", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json(groups);
  } catch (err) {
    console.error('Erro ao buscar grupos:', err);
    return res.status(500).json({
      message: 'Erro ao buscar grupos'
    });
  }
};

const updateGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { name, description, members } = req.body;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({
        message: 'Grupo não encontrado'
      });
    }

    if (name) group.name = name;
    if (description !== undefined) group.description = description;
    if (members) group.members = members;

    await group.save();

    const populatedGroup = await Group.findById(group._id)
      .populate("members", "name email")
      .populate("createdBy", "name email");

    return res.status(200).json({
      message: 'Grupo atualizado com sucesso',
      group: populatedGroup
    });
  } catch (err) {
    console.error('Erro ao atualizar grupo:', err);
    return res.status(500).json({
      message: 'Erro ao atualizar grupo'
    });
  }
};

const deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findByIdAndDelete(groupId);
    if (!group) {
      return res.status(404).json({
        message: 'Grupo não encontrado'
      });
    }

    return res.status(200).json({
      message: 'Grupo deletado com sucesso'
    });
  } catch (err) {
    console.error('Erro ao deletar grupo:', err);
    return res.status(500).json({
      message: 'Erro ao deletar grupo'
    });
  }
};

module.exports = {
  createGroup,
  getGroups,
  updateGroup,
  deleteGroup
};

