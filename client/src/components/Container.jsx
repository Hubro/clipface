/*
 * Adds left and right margin to maintain a minimum size
 */

import styled from "styled-components";

const width = 1344;
const padding = 12;

const Container = styled.div`
  max-width: ${props => props.padded ? width + padding * 2 : width}px;
  margin: 0 auto;

  ${props => props.padded ? `
    padding-left: ${padding}px;
    padding-right: ${padding}px;
  ` : ''}
`;

export default Container;
