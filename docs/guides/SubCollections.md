# Subcollections

Subcollections are collections that belong to a specific document in the database. The best way to implement subcollections is probably using a [Custom document](./guides/CustomDocuments.md) and [Reactive path functions](./guides/SourcesPathsAndReferences.md#reactive-path-functions).


```js
import { Document, Collection } from 'firestorter';

// Create custom class, which creates a subcollection
class Chat extends Document {

  // Create an on-demand messages subcollection for this chat
  get messages() {
    if (this._messages) return this._messages;
    this._messages = new Collection(() => `${this.path}/messages`);
    return this._messages;
  }
}
```

Usage with a React Component example.

```jsx
import * as React from 'react';
import { observer } from 'mobx-react';

...

const chat = new Chat('chats/782719732');

export default observer(class ChatView extends React.Component {
  render() {
    const { chat } = this.props;
    const { messages } = chat;
    return (
      <div>
        {messages.docs.map(doc => <ChatMessage doc={doc}/>)}
      </div>
    );
  }
});
```
