import { AspectBox } from '@teambit/ui.aspect-box';
import { ComponentContext } from '@teambit/component';
import React, { useContext } from 'react';
import { useDataQuery } from '@teambit/ui.hooks.use-data-query';
import { gql } from '@apollo/client';
import { EmptyBox } from '@teambit/ui.empty-box';
import { H1 } from '@teambit/documenter.ui.heading';
import { Separator } from '@teambit/documenter.ui.separator';
import styles from './aspect-page.module.scss';
import { EmptyAspectInstructions } from '@teambit/empty-aspect-instructions';

const GET_COMPONENT = gql`
  query($id: String!) {
    getHost {
      get(id: $id) {
        aspects {
          id
          config
          data
          icon
        }
      }
    }
  }
`;

export function AspectPage() {
  const component = useContext(ComponentContext);
  const { data } = useDataQuery(GET_COMPONENT, {
    variables: { id: component.id._legacy.name },
  });
  const aspectList = data?.getHost?.get?.aspects;

  if (aspectList && aspectList.length === 0) {
    return (
      <EmptyBox>
        <EmptyAspectInstructions />
      </EmptyBox>
    );
  }

  return (
    <div className={styles.aspectPage}>
      <div>
        <H1 className={styles.title}>Configuration</H1>
        <Separator className={styles.separator} />
        {aspectList &&
          aspectList.map((aspect, index) => {
            return (
              <AspectBox
                key={index}
                className={styles.aspectBox}
                name={aspect.id}
                icon={aspect.icon}
                config={aspect.config}
                data={aspect.data}
              />
            );
          })}
      </div>
    </div>
  );
}
