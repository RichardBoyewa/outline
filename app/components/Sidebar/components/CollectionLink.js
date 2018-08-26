// @flow
import * as React from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { CollectionIcon } from 'outline-icons';
import styled from 'styled-components';
import Collection from 'models/Collection';
import Document from 'models/Document';
import CollectionMenu from 'menus/CollectionMenu';
import UiStore from 'stores/UiStore';
import SidebarLink from './SidebarLink';
import DocumentLink from './DocumentLink';
import { DropdownMenu } from 'components/DropdownMenu';
import DropToImport from 'components/DropToImport';
import Flex from 'shared/components/Flex';

type Props = {
  history: Object,
  collection: Collection,
  ui: UiStore,
  activeDocument: ?Document,
  prefetchDocument: (id: string) => Promise<void>,
};

@observer
class CollectionLink extends React.Component<Props> {
  @observable menuOpen = false;

  render() {
    const {
      history,
      collection,
      activeDocument,
      prefetchDocument,
      ui,
    } = this.props;
    const expanded = collection.id === ui.activeCollectionId;

    const expandedContent = (
      <CollectionChildren popover={ui.sidebarCollapsed} column>
        {collection.documents.map(document => (
          <DocumentLink
            key={document.id}
            history={history}
            document={document}
            activeDocument={activeDocument}
            prefetchDocument={prefetchDocument}
            depth={0}
          />
        ))}
      </CollectionChildren>
    );

    const icon = (
      <CollectionIcon expanded={expanded} color={collection.color} />
    );

    return (
      <DropToImport
        key={collection.id}
        history={history}
        collectionId={collection.id}
        activeClassName="activeDropZone"
      >
        <SidebarLink
          key={collection.id}
          to={collection.url}
          icon={
            ui.sidebarCollapsed ? (
              <DropdownMenu style={{ left: 60, minWidth: 250 }} label={icon}>
                {expandedContent}
              </DropdownMenu>
            ) : (
              icon
            )
          }
          iconColor={collection.color}
          expand={expanded}
          hideExpandToggle
          menuOpen={this.menuOpen}
          expandedContent={ui.sidebarCollapsed ? undefined : expandedContent}
          menu={
            ui.sidebarCollapsed ? (
              undefined
            ) : (
              <CollectionMenu
                history={history}
                collection={collection}
                onOpen={() => (this.menuOpen = true)}
                onClose={() => (this.menuOpen = false)}
              />
            )
          }
        >
          <CollectionName justify="space-between">
            {collection.name}
          </CollectionName>
        </SidebarLink>
      </DropToImport>
    );
  }
}

const CollectionName = styled(Flex)`
  padding: 0 0 4px;
`;

const CollectionChildren = styled(Flex)`
  margin-top: -4px;
  margin-left: 36px;
  padding-bottom: 4px;
`;

export default CollectionLink;
