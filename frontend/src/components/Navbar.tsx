import React from 'react';
import styled from '@emotion/styled';
import { NavLink } from 'react-router-dom';
import { Music, BarChart3, Plus, Disc3 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store';
import { openCreateModal } from '../store/songsSlice';
import { theme } from '../styles/theme';

const HeaderContainer = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  background: rgba(9, 12, 21, 0.82);
  border-bottom: 1px solid ${theme.colors.cardBorder};
  padding: 0.85rem 1.5rem;
  transition: all ${theme.transitions.normal};
`;

const NavContent = styled.div`
  max-width: 1300px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;
`;

const BrandSection = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: ${theme.colors.textMain};

  .logo-icon-wrapper {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    background: ${theme.colors.primaryGradient};
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: ${theme.shadows.glowPrimary};
    transition: transform ${theme.transitions.fast};
  }

  &:hover .logo-icon-wrapper {
    transform: rotate(12deg) scale(1.05);
  }
`;

const BrandTitle = styled.div`
  display: flex;
  flex-direction: column;

  h1 {
    font-size: 1.25rem;
    font-weight: 800;
    line-height: 1.1;
    background: linear-gradient(135deg, #ffffff 30%, #c4b5fd 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  span {
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${theme.colors.cyan};
  }
`;

const NavLinksGroup = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.04);
  padding: 0.3rem 0.4rem;
  border-radius: ${theme.radii.full};
  border: 1px solid ${theme.colors.cardBorder};
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: ${theme.radii.full};
  font-size: 0.88rem;
  font-weight: 600;
  text-decoration: none;
  color: ${theme.colors.textMuted};
  transition: all ${theme.transitions.fast};

  &.active {
    background: rgba(139, 92, 246, 0.2);
    color: #ffffff;
    border: 1px solid rgba(139, 92, 246, 0.4);
    box-shadow: 0 0 15px rgba(139, 92, 246, 0.25);
  }

  &:hover:not(.active) {
    color: ${theme.colors.textMain};
    background: rgba(255, 255, 255, 0.06);
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${theme.colors.primaryGradient};
  color: #ffffff;
  border: none;
  padding: 0.6rem 1.25rem;
  border-radius: ${theme.radii.full};
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: ${theme.shadows.glowPrimary};
  transition: all ${theme.transitions.fast};

  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 6px 25px rgba(236, 72, 153, 0.45);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { songs } = useAppSelector((state) => state.songs);

  return (
    <HeaderContainer>
      <NavContent>
        <BrandSection to="/songs">
          <div className="logo-icon-wrapper">
            <Disc3 size={24} color="#ffffff" />
          </div>
          <BrandTitle>
            <h1>Addis Sound</h1>
          </BrandTitle>
        </BrandSection>

        <NavLinksGroup>
          <StyledNavLink to="/songs">
            <Music size={17} />
            <span>Library ({songs.length})</span>
          </StyledNavLink>
          <StyledNavLink to="/statistics">
            <BarChart3 size={17} />
            <span>Analytics</span>
          </StyledNavLink>
        </NavLinksGroup>

        <ActionButton onClick={() => dispatch(openCreateModal())}>
          <Plus size={18} strokeWidth={2.5} />
          <span>Add Song</span>
        </ActionButton>
      </NavContent>
    </HeaderContainer>
  );
};
