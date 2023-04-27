import { Pipe, PipeTransform } from '@angular/core';
import { Post, react } from 'src/app/models/post';

@Pipe({
  name: 'checkReactType'
})
export class CheckReactTypePipe implements PipeTransform {

  transform(post: Post, reacts: react[]): string {
    const reactFound = reacts.find(
      (react) => (react.postID === post._id) && (react.belongsTo === 'post')
    );
    return reactFound?.type || "Like";
  }

}
