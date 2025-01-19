import User from "../models/user.js";
import Meeting from "../models/meeting.js";

// Создание встречи
export const createMeeting = async (req, res) => {
  const { title, description, start_time, date, participants } = req.body;
  try {
    const meetingDate = date ? new Date(date) : new Date();
    if (participants && participants.length > 0) {
    // Создаем встречу
    const meeting = await Meeting.create({
      title,
      description,
      start_time,
      date:meetingDate,
    });

   
        const users = await User.findAll({ where: { id: participants } });

      if (users.length !== participants.length) { // проверка существуют ли те пользователи, которые указал автор встречи
        const missingIds = participants.filter(id => !users.some(user => user.id === id));
        return res.status(404).json({ message: `Users with IDs ${missingIds.join(', ')} not found.` });
      }
      await meeting.addParticipants(users); 
      return res.status(201).json(meeting);
    }
    else{
        return res.status(404).json({message:`No meeting participants listed`})
    }   
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error creating meeting' });
  }
};

export const getMeetings = async (req, res) => {
    try {
      const meetings = await Meeting.findAll({
        include: {
          model: User,
          as: 'participants', 
          attributes: ['name', 'email'],
          through:{
            attributes:[]
          }
        }
      });
      return res.status(200).json(meetings);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error fetching meetings' });
    }
  };