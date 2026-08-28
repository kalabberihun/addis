import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { X, Music2, User2, Disc, Tag, Loader2, Sparkles } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store';
import {
  closeFormModal,
  createSongRequest,
  updateSongRequest,
} from '../store/songsSlice';
import { SongInput } from '../types';
import { theme } from '../styles/theme';

const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const ModalCard = styled.div`
  background: #111625;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: ${theme.radii.lg};
  width: 100%;
  max-width: 520px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8), ${theme.shadows.glowPrimary};
  overflow: hidden;
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.02);

  h2 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #ffffff;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${theme.colors.textMuted};
  cursor: pointer;
  padding: 0.35rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${theme.transitions.fast};

  &:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.08);
  }
`;

const ModalBody = styled.form`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  label {
    font-size: 0.85rem;
    font-weight: 600;
    color: ${theme.colors.textMuted};
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  .input-icon {
    position: absolute;
    left: 1rem;
    color: ${theme.colors.cyan};
    pointer-events: none;
  }

  input, select {
    width: 100%;
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: ${theme.radii.sm};
    padding: 0.75rem 1rem 0.75rem 2.75rem;
    color: #ffffff;
    font-size: 0.95rem;
    outline: none;
    transition: all ${theme.transitions.fast};

    &:focus {
      border-color: ${theme.colors.primary};
      box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.35);
      background: rgba(0, 0, 0, 0.6);
    }

    &::placeholder {
      color: ${theme.colors.textDim};
    }
  }
`;

const GenreSuggestions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.4rem;

  button {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: ${theme.colors.textMuted};
    font-size: 0.75rem;
    font-weight: 500;
    padding: 0.2rem 0.6rem;
    border-radius: ${theme.radii.full};
    cursor: pointer;
    transition: all ${theme.transitions.fast};

    &:hover {
      background: rgba(139, 92, 246, 0.2);
      border-color: rgba(139, 92, 246, 0.4);
      color: #ffffff;
    }
  }
`;

const ErrorBanner = styled.div`
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.4);
  color: #fca5a5;
  padding: 0.65rem 0.9rem;
  border-radius: ${theme.radii.sm};
  font-size: 0.85rem;
`;

const ModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 0.5rem;
`;

const CancelBtn = styled.button`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: ${theme.colors.textMuted};
  padding: 0.65rem 1.25rem;
  border-radius: ${theme.radii.sm};
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all ${theme.transitions.fast};

  &:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const SubmitBtn = styled.button`
  background: ${theme.colors.primaryGradient};
  border: none;
  color: #ffffff;
  padding: 0.65rem 1.5rem;
  border-radius: ${theme.radii.sm};
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: ${theme.shadows.glowPrimary};
  transition: all ${theme.transitions.fast};

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(236, 72, 153, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const COMMON_GENRES = ['Pop', 'Rock', 'Hip Hop', 'R&B', 'Jazz', 'Electronic', 'Reggae', 'Classical', 'Traditional', 'Blues'];

export const SongModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isFormModalOpen, formMode, selectedSong, submitting, error } =
    useAppSelector((state) => state.songs);

  const [formData, setFormData] = useState<SongInput>({
    title: '',
    artist: '',
    album: '',
    genre: '',
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (formMode === 'edit' && selectedSong) {
      setFormData({
        title: selectedSong.title,
        artist: selectedSong.artist,
        album: selectedSong.album,
        genre: selectedSong.genre,
      });
    } else {
      setFormData({
        title: '',
        artist: '',
        album: '',
        genre: '',
      });
    }
    setValidationError(null);
  }, [formMode, selectedSong, isFormModalOpen]);

  if (!isFormModalOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setValidationError(null);
  };

  const handleGenreQuickPick = (genre: string) => {
    setFormData((prev) => ({ ...prev, genre }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setValidationError('Title is required');
      return;
    }
    if (!formData.artist.trim()) {
      setValidationError('Artist is required');
      return;
    }
    if (!formData.album.trim()) {
      setValidationError('Album is required');
      return;
    }
    if (!formData.genre.trim()) {
      setValidationError('Genre is required');
      return;
    }

    if (formMode === 'edit' && selectedSong) {
      dispatch(
        updateSongRequest({
          id: selectedSong._id,
          data: formData,
        })
      );
    } else {
      dispatch(
        createSongRequest({
          data: formData,
        })
      );
    }
  };

  return (
    <ModalBackdrop onClick={() => dispatch(closeFormModal())}>
      <ModalCard onClick={(e) => e.stopPropagation()} className="animate-fade-in">
        <ModalHeader>
          <h2>
            <Sparkles size={20} color={theme.colors.cyan} />
            {formMode === 'edit' ? 'Edit Song Details' : 'Add New Song'}
          </h2>
          <CloseButton onClick={() => dispatch(closeFormModal())}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalBody onSubmit={handleSubmit}>
          {(error || validationError) && (
            <ErrorBanner>{validationError || error}</ErrorBanner>
          )}

          <FormGroup>
            <label>
              <Music2 size={14} /> Song Title *
            </label>
            <InputWrapper>
              <Music2 className="input-icon" size={17} />
              <input
                type="text"
                name="title"
                placeholder="e.g. Tizita, Blinding Lights"
                value={formData.title}
                onChange={handleChange}
                autoFocus
              />
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <label>
              <User2 size={14} /> Artist *
            </label>
            <InputWrapper>
              <User2 className="input-icon" size={17} />
              <input
                type="text"
                name="artist"
                placeholder="e.g. Aster Aweke, The Weeknd"
                value={formData.artist}
                onChange={handleChange}
              />
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <label>
              <Disc size={14} /> Album *
            </label>
            <InputWrapper>
              <Disc className="input-icon" size={17} />
              <input
                type="text"
                name="album"
                placeholder="e.g. Hagere, After Hours"
                value={formData.album}
                onChange={handleChange}
              />
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <label>
              <Tag size={14} /> Genre *
            </label>
            <InputWrapper>
              <Tag className="input-icon" size={17} />
              <input
                type="text"
                name="genre"
                placeholder="e.g. Pop, Jazz, Traditional"
                value={formData.genre}
                onChange={handleChange}
              />
            </InputWrapper>
            <GenreSuggestions>
              {COMMON_GENRES.map((g) => (
                <button
                  type="button"
                  key={g}
                  onClick={() => handleGenreQuickPick(g)}
                >
                  +{g}
                </button>
              ))}
            </GenreSuggestions>
          </FormGroup>

          <ModalFooter>
            <CancelBtn
              type="button"
              onClick={() => dispatch(closeFormModal())}
              disabled={submitting}
            >
              Cancel
            </CancelBtn>
            <SubmitBtn type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Saving...
                </>
              ) : formMode === 'edit' ? (
                'Save Changes'
              ) : (
                'Create Song'
              )}
            </SubmitBtn>
          </ModalFooter>
        </ModalBody>
      </ModalCard>
    </ModalBackdrop>
  );
};
