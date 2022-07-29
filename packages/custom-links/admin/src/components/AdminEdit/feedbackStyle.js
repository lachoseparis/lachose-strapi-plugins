import styled from 'styled-components';
import { Box } from '@strapi/design-system/Box';
import { Flex } from '@strapi/design-system/Flex';

export const FeedbackWrapper = styled(Box)`
  position: relative;
`;

export const TextValidation = styled(Flex)`
  pointer-events: none;
  margin-top: ${({ theme }) => theme.spaces[1]};
  svg,
  img {
    margin-right: ${({ theme }) => theme.spaces[1]};
    height: ${12 / 16}rem;
    width: ${12 / 16}rem;
    path {
      fill: ${({ theme, notAvailable }) =>
        !notAvailable ? theme.colors.success600 : theme.colors.danger600};
    }
  }
`;
