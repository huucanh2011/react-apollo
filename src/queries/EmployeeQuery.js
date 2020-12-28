import { gql } from '@apollo/client'

export const EMPLOYEES_QUERY = gql`
  query AppQuery(
    $first: Int
    $after: String
    $last: Int
    $before: String
    $filterBy: EmployeeFilters
    $orderBy: EmployeeOrder
  ) {
    employees(
      first: $first
      after: $after
      last: $last
      before: $before
      filterBy: $filterBy
      orderBy: $orderBy
    ) {
      edges {
        cursor
        node {
          id
          displayName
        }
      }
      pageInfo {
        endCursor
        startCursor
        hasNextPage
        hasPreviousPage
      }
      totalCount
    }
  }
`;