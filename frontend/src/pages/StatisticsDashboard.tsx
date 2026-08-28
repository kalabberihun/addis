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

  return (
    <DashboardWrapper className="animate-fade-in">
      <PageHeader>
        <h2>
          <BarChart2 size={32} color={theme.colors.cyan} />
          <span>Catalog Analytics & Insights</span>
          {statsLoading && <Loader2 size={20} className="animate-spin" color={theme.colors.primary} />}
        </h2>
        <p>
          Real-time aggregates of songs, distinct artists, albums, and genre
          distributions.
        </p>
      </PageHeader>

      {/* KPI Cards Grid */}
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
              Artist Breakdown
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
                  statistics.songsByArtist.map((a) => (
                    <tr key={a.artist}>
                      <td className="primary-cell">{a.artist}</td>
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
                    <td colSpan={3} style={{ textAlign: 'center', color: theme.colors.textDim }}>
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
            Songs in Each Album
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
                    <td className="primary-cell">{albumItem.album}</td>
                    <td>{albumItem.artist}</td>
                    <td>
                      <CountChip variant="cyan">
                        {albumItem.songCount} {albumItem.songCount === 1 ? 'track' : 'tracks'}
                      </CountChip>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} style={{ textAlign: 'center', color: theme.colors.textDim }}>
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
