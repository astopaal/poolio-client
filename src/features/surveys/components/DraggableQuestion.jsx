import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Paper, IconButton, Box } from '@mui/material';
import { DragIndicator } from '@mui/icons-material';

const DraggableQuestion = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative',
    marginBottom: 2
  };

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      elevation={isDragging ? 4 : 1}
      sx={{
        p: 2,
        '&:hover .drag-handle': {
          visibility: 'visible'
        }
      }}
    >
      <Box sx={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)' }}>
        <IconButton
          className="drag-handle"
          sx={{
            visibility: 'hidden',
            cursor: 'grab',
            '&:active': { cursor: 'grabbing' }
          }}
          {...attributes}
          {...listeners}
        >
          <DragIndicator />
        </IconButton>
      </Box>
      <Box sx={{ pl: 6 }}>
        {children}
      </Box>
    </Paper>
  );
};

export default DraggableQuestion; 