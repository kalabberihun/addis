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
  Flame,
  Sparkles,
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
  gap: 2.5rem;
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
  gap: 1.5rem;
`;

const KpiCard = styled.div<{ gradient: string; glow: string }>`
  background: ${theme.colors.cardBg};
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid ${theme.colors.cardBorder};
  border-radius: ${theme.radii.lg};
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  box-shadow: ${theme.shadows.card};
  position: relative;
  overflow: hidden;
  transition: all ${theme.transitions.normal};

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(255, 255, 255, 0.15);
    box-shadow: ${({ glow }) => glow};
  }

  .icon-container {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    background: ${({ gradient }) => gradient};
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    flex-shrink: 0;
  }

  .details {
    display: flex;
    flex-direction: column;

    span.label {
      font-size: 0.82rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: ${theme.colors.textMuted};
    }

    span.value {
      font-size: 1.9rem;
      font-weight: 800;
      color: #ffffff;
      line-height: 1.2;
    }
  }
`;

/* Highlights / Top Record Cards */
const TopHighlightsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: 1.5rem;
`;

const HighlightCard = styled.div<{ accentColor: string; bgGlow: string }>`
  background: linear-gradient(
    135deg,
    rgba(25, 30, 50, 0.85) 0%,
    rgba(14, 18, 32, 0.95) 100%
  );
  border: 1px solid ${({ accentColor }) => accentColor};
  border-radius: ${theme.radii.lg};
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.4), ${({ bgGlow }) => bgGlow};
  transition: all ${theme.transitions.normal};

  &:hover {
    transform: translateY(-3px);
  }

  .badge-ribbon {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.75rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    padding: 0.3rem 0.75rem;
    border-radius: ${theme.radii.full};
    background: rgba(255, 255, 255, 0.08);
    color: #ffffff;
    width: fit-content;
  }

  .content-row {
    display: flex;
    align-items: center;
    gap: 1.25rem;
  }

  .trophy-icon-wrapper {
    width: 62px;
    height: 62px;
    border-radius: 18px;
    background: ${({ bgGlow }) => bgGlow};
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    flex-shrink: 0;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }

  .leader-details {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    min-width: 0;

    h4 {
      font-size: 1.4rem;
      font-weight: 800;
      color: #ffffff;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .sub-artist {
      font-size: 0.9rem;
      font-weight: 600;
      color: ${theme.colors.textMuted};
      display: flex;
      align-items: center;
      gap: 0.35rem;
    }
  }

  .stats-pills-row {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin-top: 0.25rem;
    flex-wrap: wrap;
  }
`;

const StatBadge = styled.span<{ variant?: 'amber' | 'pink' | 'cyan' }>`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.8rem;
  border-radius: ${theme.radii.full};
  font-size: 0.84rem;
  font-weight: 700;
  background: ${({ variant }) =>
    variant === 'amber'
      ? 'rgba(245, 158, 11, 0.2)'
      : variant === 'pink'
      ? 'rgba(236, 72, 153, 0.2)'
      : 'rgba(6, 182, 212, 0.2)'};
  color: ${({ variant }) =>
    variant === 'amber'
      ? '#fbbf24'
      : variant === 'pink'
      ? '#f472b6'
      : '#22d3ee'};
  border: 1px solid
    ${({ variant }) =>
      variant === 'amber'
        ? 'rgba(245, 158, 11, 0.4)'
        : variant === 'pink'
        ? 'rgba(236, 72, 153, 0.4)'
        : 'rgba(6, 182, 212, 0.4)'};
`;

const ContentSplitGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
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

const TableWrapper = styled.div`
  overflow-x: auto;
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

const CountChip = styled.span<{ variant?: 'cyan' | 'pink' }>`
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: ${theme.radii.full};
  font-weight: 700;
  font-size: 0.78rem;
  background: ${({ variant }) =>
    variant === 'pink'
      ? 'rgba(236, 72, 153, 0.15)'
      : 'rgba(6, 182, 212, 0.15)'};
  color: ${({ variant }) =>
    variant === 'pink' ? '#f472b6' : '#22d3ee'};
  border: 1px solid
    ${({ variant }) =>
      variant === 'pink'
        ? 'rgba(236, 72, 153, 0.3)'
        : 'rgba(6, 182, 212, 0.3)'};
`;

export const StatisticsDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { statistics, statsLoading } = useAppSelector((state) => state.songs);

  useEffect(() => {
    dispatch(fetchStatisticsRequest());
  }, [dispatch]);

  const totalSongs = statistics?.totalSongs ?? 0;
  const topArtist = statistics?.topArtist;
  const topAlbum = statistics?.topAlbum;

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
          distributions, and record holders.
        </p>
      </PageHeader>

      {/* KPI Overview Grid */}
      <KpiGrid>
        <KpiCard
          gradient={theme.colors.primaryGradient}
          glow="0 10px 30px rgba(139, 92, 246, 0.35)"
        >
          <div className="icon-container">
            <Music size={28} />
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
            <Users size={28} />
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
            <Disc size={28} />
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
            <Tags size={28} />
          </div>
          <div className="details">
            <span className="label">Total Genres</span>
            <span className="value">{statistics?.totalGenres ?? 0}</span>
          </div>
        </KpiCard>
      </KpiGrid>

      {/* Top Records Section: Top Artist & Top Album */}
      <TopHighlightsGrid>
        {/* Top Artist by Song Count */}
        <HighlightCard
          accentColor="rgba(245, 158, 11, 0.4)"
          bgGlow="linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)"
        >
          <div className="badge-ribbon">
            <Crown size={14} color="#fbbf24" />
            Top Artist by Song Count
          </div>
          <div className="content-row">
            <div className="trophy-icon-wrapper">
              <Crown size={32} />
            </div>
            <div className="leader-details">
              <h4 title={topArtist?.artist || 'No artist data'}>
                {topArtist ? topArtist.artist : 'N/A'}
              </h4>
              <div className="sub-artist">
                <Flame size={14} color="#f59e0b" />
                <span>Leader in catalog tracks</span>
              </div>
            </div>
          </div>
          <div className="stats-pills-row">
            <StatBadge variant="amber">
              <Music size={13} /> {topArtist?.songCount ?? 0} Songs
            </StatBadge>
            <StatBadge variant="cyan">
              <Disc size={13} /> {topArtist?.albumCount ?? 0} Albums
            </StatBadge>
          </div>
        </HighlightCard>

        {/* Top Album by Track Count */}
        <HighlightCard
          accentColor="rgba(236, 72, 153, 0.4)"
          bgGlow="linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)"
        >
          <div className="badge-ribbon">
            <Trophy size={14} color="#f472b6" />
            Top Album by Track Count
          </div>
          <div className="content-row">
            <div className="trophy-icon-wrapper">
              <Disc size={32} />
            </div>
            <div className="leader-details">
              <h4 title={topAlbum?.album || 'No album data'}>
                {topAlbum ? topAlbum.album : 'N/A'}
              </h4>
              <div className="sub-artist">
                <Users size={14} color="#ec4899" />
                <span>by {topAlbum ? topAlbum.artist : 'N/A'}</span>
              </div>
            </div>
          </div>
          <div className="stats-pills-row">
            <StatBadge variant="pink">
              <Sparkles size={13} /> {topAlbum?.songCount ?? 0} Tracks in Album
            </StatBadge>
          </div>
        </HighlightCard>
      </TopHighlightsGrid>

      <ContentSplitGrid>
        {/* Songs in Every Genre */}
        <SectionCard>
          <SectionTitle>
            <h3>
              <Tags size={18} color={theme.colors.primary} />
              Songs by Genre
            </h3>
            <span className="badge">
              {statistics?.songsByGenre?.length ?? 0} Genres
            </span>
          </SectionTitle>

          <GenreBarList>
            {statistics?.songsByGenre && statistics.songsByGenre.length > 0 ? (
              statistics.songsByGenre.map((g) => {
                const percentage =
                  totalSongs > 0 ? Math.round((g.count / totalSongs) * 100) : 0;
                return (
                  <GenreBarItem key={g.genre}>
                    <div className="bar-info">
                      <span className="genre-name">{g.genre}</span>
                      <span className="genre-count">
                        <strong>{g.count}</strong> tracks ({percentage}%)
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

        {/* Songs & Albums Each Artist Has */}
        <SectionCard>
          <SectionTitle>
            <h3>
              <Users size={18} color={theme.colors.cyan} />
              Artist Breakdown (Sorted by Song Count)
            </h3>
            <span className="badge">
              {statistics?.songsByArtist?.length ?? 0} Artists
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
                {statistics?.songsByArtist && statistics.songsByArtist.length > 0 ? (
                  statistics.songsByArtist.map((a, idx) => (
                    <tr key={a.artist}>
                      <td className="primary-cell">
                        {idx === 0 && <Crown size={14} color="#fbbf24" />}
                        {a.artist}
                      </td>
                      <td>
                        <CountChip variant="pink">{a.songCount} songs</CountChip>
                      </td>
                      <td>
                        <CountChip variant="cyan">{a.albumCount} albums</CountChip>
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
      </ContentSplitGrid>

      {/* Songs in Each Album */}
      <SectionCard>
        <SectionTitle>
          <h3>
            <ListMusic size={18} color={theme.colors.amber} />
            Songs in Each Album (Sorted by Track Count)
          </h3>
          <span className="badge">
            {statistics?.songsByAlbum?.length ?? 0} Albums
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
              {statistics?.songsByAlbum && statistics.songsByAlbum.length > 0 ? (
                statistics.songsByAlbum.map((albumItem, idx) => (
                  <tr key={`${albumItem.album}-${idx}`}>
                    <td className="primary-cell">
                      {idx === 0 && <Trophy size={14} color="#f472b6" />}
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
    </DashboardWrapper>
  );
};
