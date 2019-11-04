## Functions

<dl>
<dt><a href="#mergeUpdateData">mergeUpdateData(data, fields)</a> ⇒ <code>Object</code></dt>
<dd><p>Helper function which merges data into the source
and returns the new object.</p></dd>
<dt><a href="#isTimestamp">isTimestamp(val)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Checks whether the provided value is a valid Firestore Timestamp or Date.</p>
<p>Use this function in combination with schemas, in order to validate
that the field in the document is indeed a timestamp.</p></dd>
</dl>

<a name="mergeUpdateData"></a>

## mergeUpdateData(data, fields) ⇒ <code>Object</code>
<p>Helper function which merges data into the source
and returns the new object.</p>

**Kind**: global function  
**Returns**: <code>Object</code> - <p>Result</p>  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | <p>JSON data</p> |
| fields | <code>Object</code> | <p>JSON data that supports field-paths</p> |

<a name="isTimestamp"></a>

## isTimestamp(val) ⇒ <code>Boolean</code>
<p>Checks whether the provided value is a valid Firestore Timestamp or Date.</p>
<p>Use this function in combination with schemas, in order to validate
that the field in the document is indeed a timestamp.</p>

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| val | <code>Object</code> | <p>Value to check</p> |

**Example**  
```js
import { isTimestamp } from 'firestorter';

const TaskSchema = struct({
 name: 'string',
 startDate: isTimestamp,
 duration: 'number'
});

const doc = new Document('tasks/mytask', {
  schema: TaskSchema
});
await doc.fetch();
console.log('startDate: ', doc.data.startDate.toDate());
```
