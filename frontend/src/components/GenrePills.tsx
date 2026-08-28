import React from 'react';
import styled from '@emotion/styled';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchSongsRequest, setSelectedGenre } from '../store/songsSlice';
import { theme } from '../styles/theme';

const PillsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  overflow-x: auto;
  padding: 0.5rem 0.2rem 0.8rem 0.2rem;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const PillButton = styled.button<{ isActive: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 1rem;
  border-radius: ${theme.radii.full};
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  border: 1px solid
    ${({ isActive }) =>
      isActive ? 'rgba(139, 92, 246, 0.6)' : 'rgba(255, 255, 255, 0.08)'};
  background: ${({ isActive }) =>
    isActive
      ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(236, 72, 153, 0.3) 100%)'
      : 'rgba(255, 255, 255, 0.03)'};
  color: ${({ isActive }) => (isActive ? '#ffffff' : theme.colors.textMuted)};
  box-shadow: ${({ isActive }) =>
    isActive ? '0 0 16px rgba(139, 92, 246, 0.35)' : 'none'};
  transition: all ${theme.transitions.fast};

  &:hover {
    color: #ffffff;
    background: ${({ isActive }) =>
      isActive
        ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.4) 0%, rgba(236, 72, 153, 0.4) 100%)'
        : 'rgba(255, 255, 255, 0.08)'};
    border-color: rgba(139, 92, 246, 0.4);
    transform: translateY(-1px);
  }

  .badge {
    font-size: 0.72rem;
    padding: 0.1rem 0.45rem;
    border-radius: ${theme.radii.full};
    background: ${({ isActive }) =>
      isActive ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.08)'};
    color: #ffffff;
  }
`;

export const GenrePills: React.FC = () => {
  const dispatch = useAppDispatch();
  const { selectedGenre, statistics, songs } = useAppSelector((state) => state.songs);

  // Derive genres and counts from statistics or current song list
  const genresList: { name: string; count: number }[] = [
    {
      name: 'All',
      count: statistics?.totalSongs ?? songs.length,
    },
  ];

  if (statistics?.songsByGenre) {
    statistics.songsByGenre.forEach((g) => {
      genresList.push({ name: g.genre, count: g.count });
    });
  }

  const handleSelectGenre = (genre: string) => {
    dispatch(setSelectedGenre(genre));
    dispatch(fetchSongsRequest(genre !== 'All' ? genre : undefined));
  };

  return (
    <PillsContainer>
      {genresList.map((g) => (
        <PillButton
          key={g.name}
          isActive={selectedGenre.toLowerCase() === g.name.toLowerCase()}
          onClick={() => handleSelectGenre(g.name)}
        >
          <span>{g.name}</span>
          <span className="badge">{g.count}</span>
        </PillButton>
      ))}
    </PillsContainer>
  );
};
