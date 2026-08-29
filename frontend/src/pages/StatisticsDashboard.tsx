import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import {
  Music,
  Users,
  Disc,
  Tags,
  BarChart2,
  ListMusic,
  Loader2,
  Crown,
  Trophy,
  Clock,
  Disc3,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchStatisticsRequest } from '../store/songsSlice';
import { theme } from '../styles/theme';

const DashboardWrapper = styled.div`
  max-width: 1300px;
  margin: 0 auto;
  padding: 2rem 1.5rem 5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2.25rem;
`;

const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  h2 {
    font-size: 2.2rem;
    font-weight: 800;
    color: #ffffff;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  p {
    font-size: 1rem;
    color: ${theme.colors.textMuted};
  }
`;

const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.25rem;
`;

const KpiCard = styled.div<{ gradient: string; glow: string }>`
  background: ${theme.colors.cardBg};
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid ${theme.colors.cardBorder};
  border-radius: ${theme.radii.lg};
  padding: 1.35rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.2rem;
  box-shadow: ${theme.shadows.card};
  position: relative;
  overflow: hidden;
  transition: all ${theme.transitions.normal};

  &:hover {
    transform: translateY(-3px);
    border-color: rgba(255, 255, 255, 0.15);
    box-shadow: ${({ glow }) => glow};
  }

  .icon-container {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    background: ${({ gradient }) => gradient};
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.3);
    flex-shrink: 0;
  }

  .details {
    display: flex;
    flex-direction: column;

    span.label {
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: ${theme.colors.textMuted};
    }

    span.value {
      font-size: 1.8rem;
      font-weight: 800;
      color: #ffffff;
      line-height: 1.2;
    }
  }
`;

/* Compact Highlights / Top 3 Podium Cards (3-Column Layout) */
const TopHighlightsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
  gap: 1.15rem;
`;

const HighlightCard = styled.div<{ accentColor: string; bgGlow: string }>`
  background: linear-gradient(
    135deg,
    rgba(25, 30, 50, 0.85) 0%,
    rgba(14, 18, 32, 0.95) 100%
  );
  border: 1px solid ${({ accentColor }) => accentColor};
  border-radius: ${theme.radii.md};
  padding: 1.15rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.35), ${({ bgGlow }) => bgGlow};
  transition: all ${theme.transitions.normal};

  &:hover {
    transform: translateY(-2px);
  }

  .card-header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 0.6rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);

    .badge-ribbon {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      font-size: 0.8rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: #ffffff;
    }

    span.podium-tag {
      font-size: 0.68rem;
      font-weight: 700;
      padding: 0.15rem 0.45rem;
      border-radius: ${theme.radii.full};
      background: rgba(255, 255, 255, 0.08);
      color: ${theme.colors.textMuted};
      text-transform: uppercase;
    }
  }
`;

const Top3List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Top3Item = styled.div<{ rank: number }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.6rem;
  padding: 0.5rem 0.7rem;
  border-radius: ${theme.radii.sm};
  background: ${({ rank }) =>
    rank === 1
      ? 'rgba(245, 158, 11, 0.08)'
      : rank === 2
      ? 'rgba(148, 163, 184, 0.06)'
      : 'rgba(217, 119, 6, 0.05)'};
  border: 1px solid
    ${({ rank }) =>
      rank === 1
        ? 'rgba(245, 158, 11, 0.3)'
        : rank === 2
        ? 'rgba(148, 163, 184, 0.2)'
        : 'rgba(217, 119, 6, 0.15)'};
  transition: all ${theme.transitions.fast};

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateX(2px);
  }

  .left-info {
    display: flex;
    align-items: center;
    gap: 0.55rem;
    min-width: 0;

    .titles {
      display: flex;
      flex-direction: column;
      min-width: 0;

      .main-title {
        font-size: 0.88rem;
        font-weight: 700;
        color: #ffffff;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .sub-title {
        font-size: 0.74rem;
        color: ${theme.colors.textMuted};
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  .right-badges {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    flex-shrink: 0;
  }
`;

const ContentSplitGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
  gap: 2rem;
`;

const SectionCard = styled.div`
  background: ${theme.colors.cardBg};
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid ${theme.colors.cardBorder};
  border-radius: ${theme.radii.lg};
  padding: 1.75rem;
  box-shadow: ${theme.shadows.card};
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const SectionTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  padding-bottom: 0.85rem;
  flex-wrap: wrap;
  gap: 0.5rem;

  h3 {
    font-size: 1.2rem;
    font-weight: 700;
    color: #ffffff;
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  span.badge {
    font-size: 0.78rem;
    font-weight: 600;
    padding: 0.2rem 0.6rem;
    border-radius: ${theme.radii.full};
    background: rgba(139, 92, 246, 0.15);
    color: #c4b5fd;
  }
`;

const GenreBarList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 420px;
  overflow-y: auto;
  padding-right: 0.5rem;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.02);
    border-radius: ${theme.radii.full};
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(139, 92, 246, 0.35);
    border-radius: ${theme.radii.full};
  }
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(139, 92, 246, 0.6);
  }
`;

const GenreBarItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;

  .bar-info {
    display: flex;
    justify-content: space-between;
    font-size: 0.88rem;

    .genre-name {
      font-weight: 600;
      color: #ffffff;
    }

    .genre-count {
      color: ${theme.colors.textMuted};
      font-size: 0.82rem;

      strong {
        color: ${theme.colors.cyan};
      }
    }
  }

  .progress-track {
    width: 100%;
    height: 8px;
    border-radius: ${theme.radii.full};
    background: rgba(255, 255, 255, 0.05);
    overflow: hidden;

    .progress-fill {
      height: 100%;
      border-radius: ${theme.radii.full};
      background: ${theme.colors.primaryGradient};
      transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }
  }
`;

const RecentSongList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 420px;
  overflow-y: auto;
  padding-right: 0.5rem;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.02);
    border-radius: ${theme.radii.full};
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(16, 185, 129, 0.35);
    border-radius: ${theme.radii.full};
  }
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(16, 185, 129, 0.6);
  }
`;

const RecentSongItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.65rem 0.85rem;
  border-radius: ${theme.radii.sm};
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all ${theme.transitions.fast};

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(16, 185, 129, 0.3);
    transform: translateX(2px);
  }

  .left-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    min-width: 0;

    .disc-icon-badge {
      width: 34px;
      height: 34px;
      border-radius: 10px;
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%);
      border: 1px solid rgba(16, 185, 129, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #34d399;
      flex-shrink: 0;
    }

    .song-meta {
      display: flex;
      flex-direction: column;
      min-width: 0;

      .song-title {
        font-size: 0.92rem;
        font-weight: 700;
        color: #ffffff;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .song-artist-album {
        font-size: 0.76rem;
        color: ${theme.colors.textMuted};
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  .right-tags {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    flex-shrink: 0;
  }
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  max-height: 420px;
  overflow-y: auto;
  padding-right: 0.25rem;

  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.02);
    border-radius: ${theme.radii.full};
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(6, 182, 212, 0.35);
    border-radius: ${theme.radii.full};
  }
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(6, 182, 212, 0.6);
  }
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.88rem;

  th {
    padding: 0.75rem 1rem;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: ${theme.colors.textDim};
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    position: sticky;
    top: 0;
    background: rgba(18, 24, 38, 0.96);
    backdrop-filter: blur(12px);
    z-index: 2;
  }

  td {
    padding: 0.85rem 1rem;
    color: ${theme.colors.textMuted};
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);

    &.primary-cell {
      font-weight: 600;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
  }

  tr:hover td {
    background: rgba(255, 255, 255, 0.02);
  }
`;

const RankBadge = styled.span<{ rank: number }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  font-size: 0.7rem;
  font-weight: 800;
  margin-right: 0.35rem;
  flex-shrink: 0;
  background: ${({ rank }) =>
    rank === 1
      ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
      : rank === 2
      ? 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)'
      : rank === 3
      ? 'linear-gradient(135deg, #d97706 0%, #b45309 100%)'
      : 'rgba(255, 255, 255, 0.06)'};
  color: #ffffff;
  box-shadow: ${({ rank }) =>
    rank <= 3 ? '0 0 8px rgba(245, 158, 11, 0.3)' : 'none'};
`;

const CountChip = styled.span<{ variant?: 'cyan' | 'pink' | 'amber' | 'emerald' }>`
  display: inline-block;
  padding: 0.15rem 0.5rem;
  border-radius: ${theme.radii.full};
  font-weight: 700;
  font-size: 0.74rem;
  background: ${({ variant }) =>
    variant === 'pink'
      ? 'rgba(236, 72, 153, 0.15)'
      : variant === 'amber'
      ? 'rgba(245, 158, 11, 0.15)'
      : variant === 'emerald'
      ? 'rgba(16, 185, 129, 0.15)'
      : 'rgba(6, 182, 212, 0.15)'};
  color: ${({ variant }) =>
    variant === 'pink'
      ? '#f472b6'
      : variant === 'amber'
      ? '#fbbf24'
      : variant === 'emerald'
      ? '#34d399'
      : '#22d3ee'};
  border: 1px solid
    ${({ variant }) =>
      variant === 'pink'
        ? 'rgba(236, 72, 153, 0.3)'
        : variant === 'amber'
        ? 'rgba(245, 158, 11, 0.3)'
        : variant === 'emerald'
        ? 'rgba(16, 185, 129, 0.3)'
        : 'rgba(6, 182, 212, 0.3)'};
`;

const formatTimeAgo = (dateStr?: string) => {
  if (!dateStr) return 'Recently';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / (1000 * 60));
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
};

export const StatisticsDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { statistics, statsLoading, songs } = useAppSelector((state) => state.songs);

  useEffect(() => {
    dispatch(fetchStatisticsRequest());
  }, [dispatch]);

  const totalSongs = statistics?.totalSongs ?? 0;

  // Top 3 Artists by Song Count
  const top3Artists = statistics?.songsByArtist?.slice(0, 3) ?? [];

  // Top 3 Albums by Track Count
  const top3Albums = statistics?.songsByAlbum?.slice(0, 3) ?? [];

  // Top 3 Genres by Song Count
  const top3Genres = statistics?.songsByGenre?.slice(0, 3) ?? [];

  // All Artists (sorted by song count descending)
  const allArtists = statistics?.songsByArtist ?? [];

  // All Albums (sorted by track count descending)
  const allAlbums = statistics?.songsByAlbum ?? [];

  // All Genres
  const allGenres = statistics?.songsByGenre ?? [];

  // Recently Added Songs (use statistics.recentSongs or latest from songs state)
  const recentSongs =
    (statistics?.recentSongs && statistics.recentSongs.length > 0)
      ? statistics.recentSongs
      : songs.slice(0, 10);

  return (
    <DashboardWrapper className="animate-fade-in">
      <PageHeader>
        <h2>
          <BarChart2 size={32} color={theme.colors.cyan} />
          <span>Catalog Analytics & Insights</span>
          {statsLoading && (
            <Loader2 size={20} className="animate-spin" color={theme.colors.primary} />
          )}
        </h2>
        <p>
          Real-time aggregates of songs, distinct artists, albums, genre
          distributions, and recently added catalog tracks.
        </p>
      </PageHeader>

      {/* KPI Overview Grid */}
      <KpiGrid>
        <KpiCard
          gradient={theme.colors.primaryGradient}
          glow="0 10px 30px rgba(139, 92, 246, 0.35)"
        >
          <div className="icon-container">
            <Music size={26} />
          </div>
          <div className="details">
            <span className="label">Total Songs</span>
            <span className="value">{statistics?.totalSongs ?? 0}</span>
          </div>
        </KpiCard>

        <KpiCard
          gradient={theme.colors.secondaryGradient}
          glow="0 10px 30px rgba(6, 182, 212, 0.35)"
        >
          <div className="icon-container">
            <Users size={26} />
          </div>
          <div className="details">
            <span className="label">Total Artists</span>
            <span className="value">{statistics?.totalArtists ?? 0}</span>
          </div>
        </KpiCard>

        <KpiCard
          gradient={theme.colors.accentGold}
          glow="0 10px 30px rgba(245, 158, 11, 0.35)"
        >
          <div className="icon-container">
            <Disc size={26} />
          </div>
          <div className="details">
            <span className="label">Total Albums</span>
            <span className="value">{statistics?.totalAlbums ?? 0}</span>
          </div>
        </KpiCard>

        <KpiCard
          gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)"
          glow="0 10px 30px rgba(16, 185, 129, 0.35)"
        >
          <div className="icon-container">
            <Tags size={26} />
          </div>
          <div className="details">
            <span className="label">Total Genres</span>
            <span className="value">{statistics?.totalGenres ?? 0}</span>
          </div>
        </KpiCard>
      </KpiGrid>

      {/* Top 3 Showcases (Artists, Albums, Genres Side-by-Side) */}
      <TopHighlightsGrid>
        {/* Top 3 Artists */}
        <HighlightCard
          accentColor="rgba(245, 158, 11, 0.4)"
          bgGlow="linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(239, 68, 68, 0.05) 100%)"
        >
          <div className="card-header-row">
            <div className="badge-ribbon">
              <Crown size={16} color="#fbbf24" />
              <span>Top 3 Artists</span>
            </div>
            <span className="podium-tag">Podium</span>
          </div>

          <Top3List>
            {top3Artists.length > 0 ? (
              top3Artists.map((artistItem, idx) => (
                <Top3Item key={artistItem.artist} rank={idx + 1}>
                  <div className="left-info">
                    <RankBadge rank={idx + 1}>{idx + 1}</RankBadge>
                    <div className="titles">
                      <span className="main-title" title={artistItem.artist}>
                        {artistItem.artist}
                      </span>
                      <span className="sub-title">
                        {artistItem.albumCount} {artistItem.albumCount === 1 ? 'Album' : 'Albums'}
                      </span>
                    </div>
                  </div>
                  <div className="right-badges">
                    <CountChip variant="amber">
                      {artistItem.songCount} {artistItem.songCount === 1 ? 'Song' : 'Songs'}
                    </CountChip>
                  </div>
                </Top3Item>
              ))
            ) : (
              <p style={{ color: theme.colors.textDim, fontSize: '0.85rem' }}>No artist data available.</p>
            )}
          </Top3List>
        </HighlightCard>

        {/* Top 3 Albums */}
        <HighlightCard
          accentColor="rgba(236, 72, 153, 0.4)"
          bgGlow="linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(139, 92, 246, 0.05) 100%)"
        >
          <div className="card-header-row">
            <div className="badge-ribbon">
              <Trophy size={16} color="#f472b6" />
              <span>Top 3 Albums</span>
            </div>
            <span className="podium-tag">Podium</span>
          </div>

          <Top3List>
            {top3Albums.length > 0 ? (
              top3Albums.map((albumItem, idx) => (
                <Top3Item key={`${albumItem.album}-${idx}`} rank={idx + 1}>
                  <div className="left-info">
                    <RankBadge rank={idx + 1}>{idx + 1}</RankBadge>
                    <div className="titles">
                      <span className="main-title" title={albumItem.album}>
                        {albumItem.album}
                      </span>
                      <span className="sub-title">
                        by {albumItem.artist}
                      </span>
                    </div>
                  </div>
                  <div className="right-badges">
                    <CountChip variant="pink">
                      {albumItem.songCount} {albumItem.songCount === 1 ? 'Track' : 'Tracks'}
                    </CountChip>
                  </div>
                </Top3Item>
              ))
            ) : (
              <p style={{ color: theme.colors.textDim, fontSize: '0.85rem' }}>No album data available.</p>
            )}
          </Top3List>
        </HighlightCard>

        {/* Top 3 Genres */}
        <HighlightCard
          accentColor="rgba(139, 92, 246, 0.4)"
          bgGlow="linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.05) 100%)"
        >
          <div className="card-header-row">
            <div className="badge-ribbon">
              <Tags size={16} color="#c4b5fd" />
              <span>Top 3 Genres</span>
            </div>
            <span className="podium-tag">Podium</span>
          </div>

          <Top3List>
            {top3Genres.length > 0 ? (
              top3Genres.map((genreItem, idx) => {
                const percentage =
                  totalSongs > 0 ? Math.round((genreItem.count / totalSongs) * 100) : 0;
                return (
                  <Top3Item key={genreItem.genre} rank={idx + 1}>
                    <div className="left-info">
                      <RankBadge rank={idx + 1}>{idx + 1}</RankBadge>
                      <div className="titles">
                        <span className="main-title" title={genreItem.genre}>
                          {genreItem.genre}
                        </span>
                        <span className="sub-title">
                          {percentage}% of catalog
                        </span>
                      </div>
                    </div>
                    <div className="right-badges">
                      <CountChip variant="cyan">
                        {genreItem.count} {genreItem.count === 1 ? 'Track' : 'Tracks'}
                      </CountChip>
                    </div>
                  </Top3Item>
                );
              })
            ) : (
              <p style={{ color: theme.colors.textDim, fontSize: '0.85rem' }}>No genre data available.</p>
            )}
          </Top3List>
        </HighlightCard>
      </TopHighlightsGrid>

      {/* Row 1: Songs by Genre & Recently Added Songs */}
      <ContentSplitGrid>
        {/* All Songs in Every Genre */}
        <SectionCard>
          <SectionTitle>
            <h3>
              <Tags size={18} color={theme.colors.primary} />
              Songs by Genre
            </h3>
            <span className="badge">
              {allGenres.length} {allGenres.length === 1 ? 'Genre' : 'Genres'}
            </span>
          </SectionTitle>

          <GenreBarList>
            {allGenres.length > 0 ? (
              allGenres.map((g) => {
                const percentage =
                  totalSongs > 0 ? Math.round((g.count / totalSongs) * 100) : 0;
                return (
                  <GenreBarItem key={g.genre}>
                    <div className="bar-info">
                      <span className="genre-name">{g.genre}</span>
                      <span className="genre-count">
                        <strong>{g.count}</strong> {g.count === 1 ? 'track' : 'tracks'} ({percentage}%)
                      </span>
                    </div>
                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </GenreBarItem>
                );
              })
            ) : (
              <p style={{ color: theme.colors.textDim }}>No genre data available.</p>
            )}
          </GenreBarList>
        </SectionCard>

        {/* Recently Added Songs */}
        <SectionCard>
          <SectionTitle>
            <h3>
              <Clock size={18} color="#34d399" />
              Recently Added Songs
            </h3>
            <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7' }}>
              Latest {recentSongs.length}
            </span>
          </SectionTitle>

          <RecentSongList>
            {recentSongs.length > 0 ? (
              recentSongs.map((song) => (
                <RecentSongItem key={song._id}>
                  <div className="left-content">
                    <div className="disc-icon-badge">
                      <Disc3 size={18} />
                    </div>
                    <div className="song-meta">
                      <span className="song-title" title={song.title}>
                        {song.title}
                      </span>
                      <span className="song-artist-album" title={`${song.artist} • ${song.album}`}>
                        {song.artist} &bull; {song.album}
                      </span>
                    </div>
                  </div>
                  <div className="right-tags">
                    <CountChip variant="emerald">
                      {formatTimeAgo(song.createdAt)}
                    </CountChip>
                    <CountChip variant="cyan">
                      {song.genre}
                    </CountChip>
                  </div>
                </RecentSongItem>
              ))
            ) : (
              <p style={{ color: theme.colors.textDim }}>No recently added songs.</p>
            )}
          </RecentSongList>
        </SectionCard>
      </ContentSplitGrid>

      {/* Row 2: Artists Directory & Albums Directory */}
      <ContentSplitGrid>
        {/* Artists (Shows ALL Artists) */}
        <SectionCard>
          <SectionTitle>
            <h3>
              <Users size={18} color={theme.colors.cyan} />
              Artists
            </h3>
            <span className="badge">
              {allArtists.length} {allArtists.length === 1 ? 'Artist' : 'Artists'}
            </span>
          </SectionTitle>

          <TableWrapper>
            <StyledTable>
              <thead>
                <tr>
                  <th>Artist</th>
                  <th>Songs</th>
                  <th>Albums</th>
                </tr>
              </thead>
              <tbody>
                {allArtists.length > 0 ? (
                  allArtists.map((a) => (
                    <tr key={a.artist}>
                      <td className="primary-cell">
                        {a.artist}
                      </td>
                      <td>
                        <CountChip variant="pink">{a.songCount} {a.songCount === 1 ? 'song' : 'songs'}</CountChip>
                      </td>
                      <td>
                        <CountChip variant="cyan">{a.albumCount} {a.albumCount === 1 ? 'album' : 'albums'}</CountChip>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      style={{ textAlign: 'center', color: theme.colors.textDim }}
                    >
                      No artist data yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </StyledTable>
          </TableWrapper>
        </SectionCard>

        {/* Albums (Shows ALL Albums) */}
        <SectionCard>
          <SectionTitle>
            <h3>
              <ListMusic size={18} color={theme.colors.amber} />
              Albums
            </h3>
            <span className="badge">
              {allAlbums.length} {allAlbums.length === 1 ? 'Album' : 'Albums'}
            </span>
          </SectionTitle>

          <TableWrapper>
            <StyledTable>
              <thead>
                <tr>
                  <th>Album Title</th>
                  <th>Artist</th>
                  <th>Songs in Album</th>
                </tr>
              </thead>
              <tbody>
                {allAlbums.length > 0 ? (
                  allAlbums.map((albumItem, idx) => (
                    <tr key={`${albumItem.album}-${idx}`}>
                      <td className="primary-cell">
                        {albumItem.album}
                      </td>
                      <td>{albumItem.artist}</td>
                      <td>
                        <CountChip variant="cyan">
                          {albumItem.songCount}{' '}
                          {albumItem.songCount === 1 ? 'track' : 'tracks'}
                        </CountChip>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      style={{ textAlign: 'center', color: theme.colors.textDim }}
                    >
                      No album data available.
                    </td>
                  </tr>
                )}
              </tbody>
            </StyledTable>
          </TableWrapper>
        </SectionCard>
      </ContentSplitGrid>
    </DashboardWrapper>
  );
};
