/** @jsx jsx */
import { jsx, Styled } from 'theme-ui'
import { graphql } from 'gatsby'
import BlockContent from '../components/block-content'
import Container from '../components/container'
import GraphQLErrorList from '../components/graphql-error-list'
import SEO from '../components/seo'
import Layout from '../containers/layout'

export const query = graphql`
  query DataPageQuery {
    page: sanityPage(_id: { regex: "/(drafts.|)contact/" }) {
      title
      _rawBody
    }
  }
`

const DataPage = props => {
  const { data, errors } = props

  if (errors) {
    return (
      <Layout>
        <GraphQLErrorList errors={errors} />
      </Layout>
    )
  }

  const page = data.page

  if (!page) {
    throw new Error(
      'Missing "Contact" page data. Open the studio at http://localhost:3333 and add "Contact" page data and restart the development server.'
    )
  }

  return (
    <Layout>
      <SEO title={page.title} />
      <Container>
        <Styled.h1>{page.title}</Styled.h1>
        <BlockContent blocks={page._rawBody || []} />
      </Container>
    </Layout>
  )
}
DataPage.defaultProps = {
  data: {
    page: {
      title: 'No title'
    }
  }
}
export default DataPage
