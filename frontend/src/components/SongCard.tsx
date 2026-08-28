import React from 'react';
import styled from '@emotion/styled';
import { Edit2, Trash2, Disc, User, Radio } from 'lucide-react';
import { Song } from '../types';
import { useAppDispatch } from '../store';
import { openEditModal, setDeletingSongId } from '../store/songsSlice';
import { theme } from '../styles/theme';

const Card = styled.div`
  background: ${theme.colors.cardBg};
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid ${theme.colors.cardBorder};
  border-radius: ${theme.radii.md};
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
  transition: all ${theme.transitions.normal};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${theme.colors.primaryGradient};
    opacity: 0;
    transition: opacity ${theme.transitions.fast};
  }

  &:hover {
    background: ${theme.colors.cardBgHover};
    border-color: ${theme.colors.cardBorderHover};
    transform: translateY(-4px);
    box-shadow: ${theme.shadows.cardHover};

    &::before {
      opacity: 1;
    }
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
`;

const AlbumArt = styled.div<{ gradientIndex: number }>`
  width: 54px;
  height: 54px;
  border-radius: 12px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ gradientIndex }) => {
    const gradients = [
      'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
      'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
      'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
      'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
    ];
    return gradients[gradientIndex % gradients.length];
  }};
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.35);
  color: #ffffff;
`;

const SongInfo = styled.div`
  flex: 1;
  min-width: 0;

  h3 {
    font-size: 1.08rem;
    font-weight: 700;
    color: ${theme.colors.textMain};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 0.2rem;
  }

  .artist {
    font-size: 0.88rem;
    font-weight: 500;
    color: ${theme.colors.textMuted};
    display: flex;
    align-items: center;
    gap: 0.35rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const MetaList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: ${theme.radii.sm};
  font-size: 0.82rem;
  color: ${theme.colors.textMuted};

  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    span {
      color: ${theme.colors.textMain};
      font-weight: 500;
    }
  }
`;

const GenreBadge = styled.span<{ genre: string }>`
  align-self: flex-start;
  padding: 0.25rem 0.65rem;
  border-radius: ${theme.radii.full};
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  background: rgba(139, 92, 246, 0.15);
  color: #c4b5fd;
  border: 1px solid rgba(139, 92, 246, 0.3);
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.6rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
`;

const ActionsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const IconButton = styled.button<{ variant?: 'edit' | 'delete' }>`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: ${({ variant }) =>
    variant === 'delete' ? theme.colors.rose : theme.colors.cyan};
  cursor: pointer;
  transition: all ${theme.transitions.fast};

  &:hover {
    background: ${({ variant }) =>
      variant === 'delete'
        ? 'rgba(244, 63, 94, 0.15)'
        : 'rgba(6, 182, 212, 0.15)'};
    border-color: ${({ variant }) =>
      variant === 'delete' ? 'rgba(244, 63, 94, 0.4)' : 'rgba(6, 182, 212, 0.4)'};
    transform: scale(1.08);
  }
`;

interface SongCardProps {
  song: Song;
  index: number;
}

export const SongCard: React.FC<SongCardProps> = ({ song, index }) => {
  const dispatch = useAppDispatch();

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <AlbumArt gradientIndex={index}>
          <Disc size={28} />
        </AlbumArt>
        <SongInfo>
          <h3 title={song.title}>{song.title}</h3>
          <div className="artist" title={song.artist}>
            <User size={13} />
            <span>{song.artist}</span>
          </div>
        </SongInfo>
      </CardHeader>

      <MetaList>
        <div className="meta-item">
          <Radio size={13} color={theme.colors.cyan} />
          Album: <span>{song.album}</span>
        </div>
      </MetaList>

      <CardFooter>
        <GenreBadge genre={song.genre}>{song.genre}</GenreBadge>
        <ActionsGroup>
          <IconButton
            variant="edit"
            title="Edit Song"
            onClick={() => dispatch(openEditModal(song))}
          >
            <Edit2 size={14} />
          </IconButton>
          <IconButton
            variant="delete"
            title="Delete Song"
            onClick={() => dispatch(setDeletingSongId(song._id))}
          >
            <Trash2 size={14} />
          </IconButton>
        </ActionsGroup>
      </CardFooter>
    </Card>
  );
};
