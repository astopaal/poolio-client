import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { v4 as uuidv4 } from 'uuid';

import DraggableQuestion from './DraggableQuestion';
import QuestionEditor from './questions/QuestionEditor';
import { QUESTION_TYPES, QUESTION_TYPE_LABELS, QUESTION_TYPE_ICONS, getEmptyQuestion } from './questions/QuestionTypes';
import { updateSurveyField, reorderQuestions, addQuestion } from '../store/surveySlice';

const SurveyForm = () => {
  const dispatch = useDispatch();
  const { currentSurvey, questions } = useSelector(state => state.survey);
  const [anchorEl, setAnchorEl] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = questions.findIndex(q => q.id === active.id);
      const newIndex = questions.findIndex(q => q.id === over.id);
      dispatch(reorderQuestions(arrayMove(questions, oldIndex, newIndex)));
    }
  };

  const handleAddQuestionClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleQuestionTypeSelect = (type) => {
    const newQuestion = {
      ...getEmptyQuestion(type, questions.length),
      id: uuidv4()
    };
    dispatch(addQuestion(newQuestion));
    setAnchorEl(null);
  };

  const handleTitleChange = (event) => {
    dispatch(updateSurveyField({ field: 'title', value: event.target.value }));
  };

  const handleDescriptionChange = (event) => {
    dispatch(updateSurveyField({ field: 'description', value: event.target.value }));
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', py: 4 }}>
      {/* Anket Başlığı ve Açıklaması */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <TextField
          fullWidth
          label="Anket Başlığı"
          value={currentSurvey?.title || ''}
          onChange={handleTitleChange}
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Açıklama"
          value={currentSurvey?.description || ''}
          onChange={handleDescriptionChange}
          multiline
          rows={3}
          variant="outlined"
        />
      </Paper>

      {/* Sorular */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={questions.map(q => q.id)}
          strategy={verticalListSortingStrategy}
        >
          {questions.map((question) => (
            <DraggableQuestion key={question.id} id={question.id}>
              <QuestionEditor question={question} />
            </DraggableQuestion>
          ))}
        </SortableContext>
      </DndContext>

      {/* Soru Ekleme Butonu */}
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddQuestionClick}
          sx={{ borderRadius: 8 }}
        >
          Soru Ekle
        </Button>
      </Box>

      {/* Soru Tipi Menüsü */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        {Object.entries(QUESTION_TYPES).map(([key, value]) => {
          const Icon = QUESTION_TYPE_ICONS[value];
          return (
            <MenuItem
              key={key}
              onClick={() => handleQuestionTypeSelect(value)}
              sx={{ py: 1.5, minWidth: 250 }}
            >
              <ListItemIcon>
                <Icon />
              </ListItemIcon>
              <ListItemText primary={QUESTION_TYPE_LABELS[value]} />
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
};

export default SurveyForm; 