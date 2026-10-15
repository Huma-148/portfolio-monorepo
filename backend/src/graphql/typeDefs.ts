/**
 * GraphQL schema (SDL) for the portfolio API.
 *
 * Field names and nullability mirror `prisma/schema.prisma`. Access rules are
 * documented in the descriptions ("Public" / "Admin only"); they are NOT
 * enforced by the SDL itself. Resolvers enforce them using `ctx.auth.role`.
 *
 * The graph is deliberately acyclic (no back-references such as
 * `User.messages` or `Reply.message`), which naturally bounds query depth.
 */

/** Custom scalar and enums shared by the object types. */
const scalarAndEnumDefs: string = /* GraphQL */ `
  """
  ISO 8601 date-time string, e.g. 2026-10-15T08:30:00.000Z.
  """
  scalar DateTime

  """
  Account role. ADMIN can manage messages and analytics; VISITOR is a public sender.
  """
  enum Role {
    ADMIN
    VISITOR
  }

  """
  Lifecycle state of a contact message.
  """
  enum MessageStatus {
    UNREAD
    READ
    REPLIED
  }
`;

/** Object types mapped one-to-one onto the relational models. */
const objectTypeDefs: string = /* GraphQL */ `
  """
  A person who contacted the portfolio owner, or an administrator.
  """
  type User {
    id: ID!
    email: String!
    name: String!
    role: Role!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  """
  A contact message submitted through the portfolio contact form.
  """
  type Message {
    id: ID!
    userId: ID!
    "Short title of the message (max 255 characters)."
    subject: String!
    "Full message body. Submitted by the frontend as FormState.message."
    content: String!
    status: MessageStatus!
    createdAt: DateTime!
    updatedAt: DateTime!
    "The sender."
    user: User!
    "Administrator replies, oldest first."
    replies: [Reply!]!
  }

  """
  An administrator's reply to a Message.
  """
  type Reply {
    id: ID!
    messageId: ID!
    "Id of the administrator who wrote the reply."
    adminId: ID!
    content: String!
    createdAt: DateTime!
  }

  """
  One tracked visitor interaction, used for analytics.
  """
  type ActivityLog {
    id: ID!
    "Set only when the visitor is identified; anonymous activity has no user."
    userId: ID
    "What happened, e.g. page_view or click (max 100 characters)."
    action: String!
    "Device class, e.g. desktop or mobile (max 20 characters)."
    deviceType: String!
    "Browser name (max 50 characters)."
    browser: String!
    "Country code of the visitor (max 10 characters)."
    country: String!
    "DOM id of the element that was interacted with, if any."
    targetElementId: String
    "How long the interaction lasted, in seconds, if measured."
    durationSeconds: Int
    createdAt: DateTime!
    user: User
  }

  """
  Aggregated figures for the admin dashboard.
  """
  type DashboardStats {
    totalMessages: Int!
    unreadCount: Int!
    "Most frequent activity action, or null when nothing has been logged yet."
    topAction: String
    "Country with the most activity, or null when nothing has been logged yet."
    topCountry: String
  }
`;

/** Read operations. */
const queryDefs: string = /* GraphQL */ `
  type Query {
    """
    Liveness probe. Public.
    """
    _health: String!

    """
    Admin only. Lists messages, newest first. Optional status filter
    (UNREAD, READ or REPLIED); an unknown status is rejected by the resolver.
    """
    getMessages(status: String): [Message!]!

    """
    Admin only. Fetches one message with its sender and replies, or null if the id does not exist.
    """
    getMessageDetails(id: ID!): Message

    """
    Admin only. Totals and top action/country for the dashboard.
    """
    getAnalyticsOverview: DashboardStats!
  }
`;

/** Write operations. */
const mutationDefs: string = /* GraphQL */ `
  type Mutation {
    """
    Public. Stores a contact-form submission, creating the sender if needed.
    The frontend field FormState.message is sent as content. When subject is
    omitted the resolver uses a default subject.
    """
    submitContactForm(
      name: String!
      email: String!
      subject: String
      content: String!
    ): Message!

    """
    Public. Records one visitor interaction for analytics. Always returns true on success.
    """
    logActivity(
      action: String!
      deviceType: String!
      browser: String!
      country: String!
      targetElementId: String
      durationSeconds: Int
    ): Boolean!

    """
    Admin only. Adds a reply to a message, authored by the calling administrator.
    """
    replyToMessage(messageId: ID!, content: String!): Reply!

    """
    Admin only. Sets a message status to UNREAD, READ or REPLIED; any other value is rejected by the resolver.
    """
    updateMessageStatus(id: ID!, status: String!): Message!
  }
`;

/**
 * The complete schema definition handed to the GraphQL server: all fragments
 * joined into a single SDL document.
 */
export const typeDefs: string = [
  scalarAndEnumDefs,
  objectTypeDefs,
  queryDefs,
  mutationDefs,
].join("\n");

export default typeDefs;
