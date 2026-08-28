import React, { useEffect, useState, useMemo } from 'react';
import styled from '@emotion/styled';
import {
  Search,
  Plus,
  Music4,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store';
import {
  fetchSongsRequest,
  fetchStatisticsRequest,
  openCreateModal,
  createSongRequest,
} from '../store/songsSlice';
import { SongCard } from '../components/SongCard';
import { GenrePills } from '../components/GenrePills';
import { theme } from '../styles/theme';

const PageWrapper = styled.div`
  max-width: 1300px;
  margin: 0 auto;
  padding: 2rem 1.5rem 5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const HeroBanner = styled.div`
  background: linear-gradient(135deg, rgba(22, 27, 44, 0.8) 0%, rgba(13, 17, 30, 0.9) 100%);
  border: 1px solid ${theme.colors.cardBorder};
  border-radius: ${theme.radii.lg};
  padding: 2.25rem;
  position: relative;
  overflow: hidden;
  box-shadow: ${theme.shadows.card};

  &::after {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 350px;
    height: 350px;
    background: radial-gradient(circle, rgba(139, 92, 246, 0.18) 0%, transparent 70%);
    pointer-events: none;
  }
`;

const HeroTitle = styled.h2`
  font-size: 2rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;

  .gradient-text {
    background: ${theme.colors.primaryGradient};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const SongCountBadge = styled.span`
  font-size: 0.85rem;
  font-weight: 700;
  padding: 0.25rem 0.75rem;
  border-radius: ${theme.radii.full};
  background: rgba(139, 92, 246, 0.2);
  color: #c4b5fd;
  border: 1px solid rgba(139, 92, 246, 0.35);
  box-shadow: 0 0 12px rgba(139, 92, 246, 0.25);
`;

const HeroSubtitle = styled.p`
  font-size: 0.95rem;
  color: ${theme.colors.textMuted};
  max-width: 600px;
`;

const ControlsBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
`;

const SearchInputWrapper = styled.div`
  position: relative;
  flex: 1;
  min-width: 260px;
  max-width: 450px;

  .search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: ${theme.colors.textDim};
  }

  input {
    width: 100%;
    background: rgba(18, 24, 38, 0.8);
    border: 1px solid ${theme.colors.cardBorder};
    border-radius: ${theme.radii.full};
    padding: 0.7rem 1rem 0.7rem 2.75rem;
    color: #ffffff;
    font-size: 0.9rem;
    outline: none;
    transition: all ${theme.transitions.fast};

    &:focus {
      border-color: ${theme.colors.primary};
      box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.3);
      background: rgba(18, 24, 38, 1);
    }

    &::placeholder {
      color: ${theme.colors.textDim};
    }
  }
`;

const SortSelect = styled.select`
  background: rgba(18, 24, 38, 0.8);
  border: 1px solid ${theme.colors.cardBorder};
  border-radius: ${theme.radii.full};
  padding: 0.7rem 1.25rem;
  color: ${theme.colors.textMain};
  font-size: 0.88rem;
  font-weight: 500;
  outline: none;
  cursor: pointer;
  transition: all ${theme.transitions.fast};

  &:focus {
    border-color: ${theme.colors.primary};
  }

  option {
    background: #111625;
    color: #ffffff;
  }
`;

const SongsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const EmptyStateContainer = styled.div`
  grid-column: 1 / -1;
  background: rgba(18, 24, 38, 0.4);
  border: 2px dashed ${theme.colors.cardBorder};
  border-radius: ${theme.radii.lg};
  padding: 4rem 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;

  .icon-circle {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: rgba(139, 92, 246, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${theme.colors.primary};
  }

  h3 {
    font-size: 1.3rem;
    color: #ffffff;
  }

  p {
    font-size: 0.92rem;
    color: ${theme.colors.textMuted};
    max-width: 420px;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 0.5rem;
`;

const ActionBtn = styled.button<{ secondary?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: ${({ secondary }) =>
    secondary ? 'rgba(255, 255, 255, 0.08)' : theme.colors.primaryGradient};
  color: #ffffff;
  border: ${({ secondary }) =>
    secondary ? '1px solid rgba(255, 255, 255, 0.15)' : 'none'};
  padding: 0.65rem 1.3rem;
  border-radius: ${theme.radii.full};
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all ${theme.transitions.fast};

  &:hover {
    transform: translateY(-2px);
    background: ${({ secondary }) =>
      secondary ? 'rgba(255, 255, 255, 0.15)' : theme.colors.primaryGradient};
  }
`;

const SAMPLE_SONGS = [
  { title: 'Tizita', artist: 'Aster Aweke', album: 'Hagere', genre: 'Traditional' },
  { title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', genre: 'Pop' },
  { title: 'Bohemian Rhapsody', artist: 'Queen', album: 'A Night at the Opera', genre: 'Rock' },
  { title: 'Take Five', artist: 'Dave Brubeck', album: 'Time Out', genre: 'Jazz' },
  { title: 'HUMBLE.', artist: 'Kendrick Lamar', album: 'DAMN.', genre: 'Hip Hop' },
  { title: 'Redemption Song', artist: 'Bob Marley', album: 'Uprising', genre: 'Reggae' },
];

export const MusicLibrary: React.FC = () => {
  const dispatch = useAppDispatch();
  const { songs, loading, selectedGenre } = useAppSelector((state) => state.songs);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'title' | 'artist' | 'album'>('newest');

  useEffect(() => {
    dispatch(fetchSongsRequest(selectedGenre !== 'All' ? selectedGenre : undefined));
    dispatch(fetchStatisticsRequest());
  }, [dispatch, selectedGenre]);

  const filteredSongs = useMemo(() => {
    let result = [...songs];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.artist.toLowerCase().includes(q) ||
          s.album.toLowerCase().includes(q) ||
          s.genre.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'artist') {
      result.sort((a, b) => a.artist.localeCompare(b.artist));
    } else if (sortBy === 'album') {
      result.sort((a, b) => a.album.localeCompare(b.album));
    }

    return result;
  }, [songs, searchTerm, sortBy]);

  const handleSeedSamples = () => {
    SAMPLE_SONGS.forEach((song) => {
      dispatch(createSongRequest({ data: song }));
    });
  };

  return (
    <PageWrapper className="animate-fade-in">
      <HeroBanner>
        <HeroTitle>
          <span>🎵 Addis</span>
          <span className="gradient-text">Song Collection</span>
          <SongCountBadge>
            {songs.length} {songs.length === 1 ? 'Song' : 'Songs'}
          </SongCountBadge>
        </HeroTitle>
        <HeroSubtitle>
          Explore, filter, manage, and curate your audio universe.
        </HeroSubtitle>
      </HeroBanner>

      <GenrePills />

      <ControlsBar>
        <SearchInputWrapper>
          <Search className="search-icon" size={17} />
          <input
            type="text"
            placeholder="Search by title, artist, album, genre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchInputWrapper>

        <SortSelect
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
        >
          <option value="newest">Sort by: Recently Added</option>
          <option value="title">Sort by: Title (A - Z)</option>
          <option value="artist">Sort by: Artist (A - Z)</option>
          <option value="album">Sort by: Album (A - Z)</option>
        </SortSelect>
      </ControlsBar>

      <SongsGrid>
        {loading && songs.length === 0 ? (
          <EmptyStateContainer>
            <div className="icon-circle">
              <Loader2 size={30} className="animate-spin" />
            </div>
            <h3>Loading Songs...</h3>
            <p>Fetching your catalog from the Addis backend.</p>
          </EmptyStateContainer>
        ) : filteredSongs.length > 0 ? (
          filteredSongs.map((song, index) => (
            <SongCard key={song._id} song={song} index={index} />
          ))
        ) : (
          <EmptyStateContainer>
            <div className="icon-circle">
              <Music4 size={30} />
            </div>
            <h3>No Songs Found</h3>
            <p>
              {searchTerm
                ? `No songs match your search "${searchTerm}". Try resetting your filter or adding a new track.`
                : selectedGenre !== 'All'
                ? `No songs found under genre "${selectedGenre}".`
                : 'Your library is empty. Start adding tracks to unlock full analytics!'}
            </p>
            <ButtonRow>
              <ActionBtn onClick={() => dispatch(openCreateModal())}>
                <Plus size={16} /> Add First Song
              </ActionBtn>
              {songs.length === 0 && (
                <ActionBtn secondary onClick={handleSeedSamples}>
                  <Sparkles size={16} /> Seed Sample Tracks
                </ActionBtn>
              )}
            </ButtonRow>
          </EmptyStateContainer>
        )}
      </SongsGrid>
    </PageWrapper>
  );
};
