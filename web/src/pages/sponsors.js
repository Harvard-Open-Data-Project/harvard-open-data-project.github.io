/** @jsx jsx */
import { jsx, Styled } from 'theme-ui'
import { graphql } from 'gatsby'
import BlockContent from '../components/block-content'
import Container from '../components/core/container'
import GraphQLErrorList from '../components/core/graphql-error-list'
import SEO from '../components/core/seo'
import Layout from '../containers/layout'
import { mapEdgesToNodes, filterOutDocsWithoutSlugs } from '../lib/helpers'

export const query = graphql`
  query SponsorsPageQuery {
    page: sanityPage(_id: { regex: "/(drafts.|)sponsors/" }) {
      id
      title
      _rawBody
    }
  }
`

const SponsorsPage = props => {
  const { data, errors } = props

  if (errors) {
    return (
      <Layout>
        <GraphQLErrorList errors={errors} />
      </Layout>
    )
  }

  const page = data && data.page

  if (!page) {
    throw new Error(
      'Missing "Sponsors" page data. Open the studio at http://localhost:3333 and add "Sponsors" page data and restart the development server.'
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

export default SponsorsPage
