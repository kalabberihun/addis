import React from 'react';
import styled from '@emotion/styled';
import { AlertTriangle, Trash2, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store';
import { deleteSongRequest, setDeletingSongId } from '../store/songsSlice';
import { theme } from '../styles/theme';

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 210;
  background: rgba(0, 0, 0, 0.78);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const Dialog = styled.div`
  background: #111625;
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: ${theme.radii.lg};
  width: 100%;
  max-width: 440px;
  padding: 1.5rem;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(239, 68, 68, 0.2);
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const WarningHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  .icon-wrapper {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: rgba(239, 68, 68, 0.15);
    border: 1px solid rgba(239, 68, 68, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${theme.colors.danger};
  }

  h3 {
    font-size: 1.15rem;
    color: #ffffff;
    font-weight: 700;
  }
`;

const WarningText = styled.p`
  font-size: 0.92rem;
  color: ${theme.colors.textMuted};
  line-height: 1.5;

  strong {
    color: #ffffff;
    font-weight: 600;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
`;

const CancelBtn = styled.button`
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: ${theme.colors.textMuted};
  padding: 0.6rem 1.2rem;
  border-radius: ${theme.radii.sm};
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: all ${theme.transitions.fast};

  &:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.12);
  }
`;

const DeleteBtn = styled.button`
  background: ${theme.colors.dangerGradient};
  border: none;
  color: #ffffff;
  padding: 0.6rem 1.25rem;
  border-radius: ${theme.radii.sm};
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  box-shadow: 0 0 15px rgba(239, 68, 68, 0.4);
  transition: all ${theme.transitions.fast};

  &:hover:not(:disabled) {
    box-shadow: 0 4px 20px rgba(239, 68, 68, 0.6);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const DeleteConfirmModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { deletingSongId, songs, submitting } = useAppSelector(
    (state) => state.songs
  );

  if (!deletingSongId) return null;

  const targetSong = songs.find((s) => s._id === deletingSongId);
  const songTitle = targetSong ? `"${targetSong.title}"` : 'this song';

  const handleConfirm = () => {
    if (deletingSongId) {
      dispatch(
        deleteSongRequest({
          id: deletingSongId,
          title: targetSong?.title || 'Song',
        })
      );
    }
  };

  return (
    <Backdrop onClick={() => dispatch(setDeletingSongId(null))}>
      <Dialog onClick={(e) => e.stopPropagation()} className="animate-fade-in">
        <WarningHeader>
          <div className="icon-wrapper">
            <AlertTriangle size={24} />
          </div>
          <h3>Confirm Delete</h3>
        </WarningHeader>

        <WarningText>
          Are you sure you want to permanently delete <strong>{songTitle}</strong>?
          This action cannot be undone.
        </WarningText>

        <ButtonRow>
          <CancelBtn
            onClick={() => dispatch(setDeletingSongId(null))}
            disabled={submitting}
          >
            Cancel
          </CancelBtn>
          <DeleteBtn onClick={handleConfirm} disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 size={15} className="animate-spin" /> Deleting...
              </>
            ) : (
              <>
                <Trash2 size={15} /> Delete Permanently
              </>
            )}
          </DeleteBtn>
        </ButtonRow>
      </Dialog>
    </Backdrop>
  );
};
