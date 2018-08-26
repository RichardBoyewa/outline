// @flow
import * as React from 'react';
import invariant from 'invariant';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { PortalWithState } from 'react-portal';
import Flex from 'shared/components/Flex';
import { fadeAndScaleIn } from 'shared/styles/animations';

type Props = {
  label?: React.Node,
  onOpen?: () => void,
  onClose?: () => void,
  children?: React.Node,
  defaultOpen?: boolean,
  className?: string,
  style?: Object,
};

@observer
class DropdownMenu extends React.Component<Props> {
  @observable top: number;
  @observable right: number;
  ref: *;

  componentDidMount() {
    const currentTarget = this.ref;

    if (this.props.defaultOpen && currentTarget) {
      invariant(document.body, 'Document should have a body');

      const bodyRect = document.body.getBoundingClientRect();
      const targetRect = currentTarget.getBoundingClientRect();
      this.top = targetRect.bottom - bodyRect.top;
      this.right = bodyRect.width - targetRect.left - targetRect.width;
      console.log(this.top, this.right);
    }
  }

  handleOpen = (openPortal: (SyntheticEvent<*>) => *) => {
    return (ev: SyntheticMouseEvent<*>) => {
      ev.preventDefault();
      const currentTarget = ev.currentTarget;
      invariant(document.body, 'Document should have a body');

      if (currentTarget instanceof HTMLDivElement) {
        const bodyRect = document.body.getBoundingClientRect();
        const targetRect = currentTarget.getBoundingClientRect();
        this.top = targetRect.bottom - bodyRect.top;
        this.right = bodyRect.width - targetRect.left - targetRect.width;
        openPortal(ev);
      }
    };
  };

  render() {
    const { className, label, children } = this.props;

    return (
      <div ref={ref => (this.ref = ref)} className={className}>
        <PortalWithState
          key={this.top}
          onOpen={this.props.onOpen}
          onClose={this.props.onClose}
          defaultOpen={this.props.defaultOpen}
          closeOnOutsideClick
          closeOnEsc
        >
          {({ closePortal, openPortal, portal }) => (
            <React.Fragment>
              {label && (
                <Label onClick={this.handleOpen(openPortal)}>{label}</Label>
              )}
              {portal(
                <Menu
                  onClick={ev => {
                    ev.stopPropagation();
                    closePortal();
                  }}
                  style={this.props.style}
                  top={this.top}
                  right={this.right}
                >
                  {children}
                </Menu>
              )}
            </React.Fragment>
          )}
        </PortalWithState>
      </div>
    );
  }
}

const Label = styled(Flex).attrs({
  justify: 'center',
  align: 'center',
})`
  z-index: 1000;
  cursor: pointer;
`;

const Menu = styled.div`
  animation: ${fadeAndScaleIn} 200ms ease;
  transform-origin: 75% 0;

  position: absolute;
  right: ${({ right }) => right}px;
  top: ${({ top }) => top}px;
  z-index: 1000;
  border: ${props => props.theme.slateLight};
  background: ${props => props.theme.white};
  border-radius: 2px;
  padding: 0.5em 0;
  min-width: 160px;
  overflow: hidden;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05), 0 4px 8px rgba(0, 0, 0, 0.08),
    0 2px 4px rgba(0, 0, 0, 0.08);

  @media print {
    display: none;
  }
`;

export default DropdownMenu;
