import { gql } from '@apollo/client';

// ============================================
// QUERIES
// ============================================

export const MY_NOTIFICATIONS_QUERY = gql`
  query MyNotifications(
    $category: String
    $isRead: Boolean
    $limit: Int = 20
    $offset: Int = 0
  ) {
    myNotifications(
      category: $category
      isRead: $isRead
      limit: $limit
      offset: $offset
    ) {
      notifications {
        id
        notificationType
        category
        priority
        title
        message
        actionUrl
        metadata
        isRead
        readAt
        actorName
        createdAt
        timeAgo
      }
      totalCount
      unreadCount
      hasMore
    }
  }
`;

export const UNREAD_COUNT_QUERY = gql`
  query UnreadCount($category: String) {
    unreadCount(category: $category)
  }
`;

export const MY_NOTIFICATION_PREFERENCES_QUERY = gql`
  query MyNotificationPreferences {
    myNotificationPreferences {
      category
      isEnabled
      isSseEnabled
      isEmailEnabled
    }
  }
`;

export const NOTIFICATION_STATS_QUERY = gql`
  query NotificationStats {
    notificationStats {
      totalCount
      unreadCount
      readCount
      byCategory
    }
  }
`;

export const NOTIFICATION_BY_ID_QUERY = gql`
  query NotificationById($notificationId: Int!) {
    notificationById(notificationId: $notificationId) {
      id
      notificationType
      category
      priority
      title
      message
      actionUrl
      metadata
      isRead
      readAt
      actorName
      createdAt
      timeAgo
    }
  }
`;

// ============================================
// MUTATIONS
// ============================================

export const MARK_NOTIFICATION_READ_MUTATION = gql`
  mutation MarkNotificationRead($notificationId: Int!) {
    markNotificationRead(notificationId: $notificationId) {
      id
      isRead
      readAt
    }
  }
`;

export const MARK_ALL_NOTIFICATIONS_READ_MUTATION = gql`
  mutation MarkAllNotificationsRead($category: String) {
    markAllNotificationsRead(category: $category)
  }
`;

export const DISMISS_NOTIFICATION_MUTATION = gql`
  mutation DismissNotification($notificationId: Int!) {
    dismissNotification(notificationId: $notificationId)
  }
`;

export const BULK_DISMISS_NOTIFICATIONS_MUTATION = gql`
  mutation BulkDismissNotifications($notificationIds: [Int!]!) {
    bulkDismissNotifications(notificationIds: $notificationIds)
  }
`;

export const UPDATE_NOTIFICATION_PREFERENCE_MUTATION = gql`
  mutation UpdateNotificationPreference(
    $category: String!
    $isEnabled: Boolean
    $isSseEnabled: Boolean
    $isEmailEnabled: Boolean
  ) {
    updateNotificationPreference(
      category: $category
      isEnabled: $isEnabled
      isSseEnabled: $isSseEnabled
      isEmailEnabled: $isEmailEnabled
    ) {
      category
      isEnabled
      isSseEnabled
      isEmailEnabled
    }
  }
`;

export const RESET_NOTIFICATION_PREFERENCES_MUTATION = gql`
  mutation ResetNotificationPreferences {
    resetNotificationPreferences {
      category
      isEnabled
      isSseEnabled
      isEmailEnabled
    }
  }
`;
