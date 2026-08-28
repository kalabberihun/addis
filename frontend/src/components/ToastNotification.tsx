import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store';
import { clearNotification } from '../store/songsSlice';
import { theme } from '../styles/theme';

const ToastContainer = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 300;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 400px;
`;

const ToastBox = styled.div<{ isError?: boolean }>`
  background: ${({ isError }) =>
    isError ? 'rgba(239, 68, 68, 0.95)' : 'rgba(16, 185, 129, 0.95)'};
  color: #ffffff;
  padding: 0.85rem 1.25rem;
  border-radius: ${theme.radii.md};
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5),
    ${({ isError }) =>
      isError
        ? '0 0 20px rgba(239, 68, 68, 0.4)'
        : '0 0 20px rgba(16, 185, 129, 0.4)'};
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
`;

const CloseBtn = styled.button`
  background: transparent;
  border: none;
  color: #ffffff;
  opacity: 0.8;
  cursor: pointer;
  padding: 0.2rem;
  margin-left: auto;
  display: flex;
  align-items: center;

  &:hover {
    opacity: 1;
  }
`;

export const ToastNotification: React.FC = () => {
  const dispatch = useAppDispatch();
  const { successMessage, error } = useAppSelector((state) => state.songs);

  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        dispatch(clearNotification());
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error, dispatch]);

  if (!successMessage && !error) return null;

  return (
    <ToastContainer>
      {successMessage && (
        <ToastBox className="animate-fade-in">
          <CheckCircle2 size={20} />
          <span>{successMessage}</span>
          <CloseBtn onClick={() => dispatch(clearNotification())}>
            <X size={16} />
          </CloseBtn>
        </ToastBox>
      )}

      {error && (
        <ToastBox isError className="animate-fade-in">
          <AlertCircle size={20} />
          <span>{error}</span>
          <CloseBtn onClick={() => dispatch(clearNotification())}>
            <X size={16} />
          </CloseBtn>
        </ToastBox>
      )}
    </ToastContainer>
  );
};
